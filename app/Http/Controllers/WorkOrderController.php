<?php

namespace App\Http\Controllers;

use App\Http\Resources\WorkOrderResource;
use App\Models\Product;
use App\Models\User;
use App\Models\WorkOrder;
use App\Models\WorkOrderProgress;
use App\Models\WorkOrderUpdate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class WorkOrderController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		$query = WorkOrder::with(['product', 'user'])->orderBy('updated_at', 'desc')->orderBy('id', 'desc');

		if ($request->has('status')) {
			$query->where('status', $request->input('status'));
		}

		if ($request->has('start_deadline') && $request->has('end_deadline')) {
			$query->whereBetween('deadline', [$request->input('start_deadline'), $request->input('end_deadline')]);
		} elseif ($request->has('start_deadline')) {
			$query->where('deadline', '>=', $request->input('start_deadline'));
		} elseif ($request->has('end_deadline')) {
			$query->where('deadline', '<=', $request->input('end_deadline'));
		}

		if ($request->user()->hasRole('Operator')) {
			$query->where('user_id', $request->user()->id);
		}

		$workOrders = $query->paginate(10)->withQueryString();

		return Inertia::render('work-orders/index', [
			'workOrders' => WorkOrderResource::collection($workOrders),
			'filters' => $request->only(['status', 'start_deadline', 'end_deadline']),
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		$products = Product::all(['id', 'name']);
		$operatorRole = Role::where('name', 'Operator')->first();
		$users = User::role($operatorRole)->get(['id', 'name']);
		return Inertia::render('work-orders/create', [
			'products' => $products,
			'users' => $users,
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request)
	{
		$validated = $request->validate([
			'product_id' => 'required|exists:products,id',
			'quantity' => 'required|integer|min:1',
			'deadline' => 'required|date',
			'user_id' => 'required|exists:users,id',
		]);

		$number = 'WO-' . now()->format('Ymd') . '-' . str_pad(WorkOrder::withTrashed()->count() + 1, 3, '0', STR_PAD_LEFT);

		WorkOrder::create([
			'number' => $number,
			'product_id' => $validated['product_id'],
			'quantity' => $validated['quantity'],
			'deadline' => $validated['deadline'],
			'status' => WorkOrder::PENDING,
			'user_id' => $validated['user_id'],
		]);

		return redirect()->route('work-orders.index')->with('message', 'Work order created successfully.');
	}

	/**
	 * Display the specified resource.
	 */
	public function show(WorkOrder $workOrder)
	{
		return Inertia::render('work-orders/show', [
			'workOrder' => new WorkOrderResource(
				$workOrder->load([
					'product',
					'user',
					'workOrderProgress' => function ($query) {
						$query->with('user')->latest();
					},
					'workOrderUpdates' => function ($query) {
						$query->with('user')->latest();
					}
				])
			),
		]);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(WorkOrder $workOrder)
	{
		$products = Product::all(['id', 'name']);
		$operatorRole = Role::where('name', 'Operator')->first();
		$users = User::role($operatorRole)->get(['id', 'name']);
		return Inertia::render('work-orders/edit', [
			'workOrder' => new WorkOrderResource($workOrder->load(['product', 'user'])),
			'products' => $products,
			'users' => $users,
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, WorkOrder $workOrder)
	{
		$validated = $request->validate([
			'product_id' => 'required|exists:products,id',
			'quantity' => 'required|integer|min:1',
			'deadline' => 'required|date',
			'status' => 'required|integer|in:' . implode(',', [WorkOrder::PENDING, WorkOrder::IN_PROGRESS, WorkOrder::COMPLETED, WorkOrder::CANCELED]),
			'user_id' => 'required|exists:users,id',
		]);

		$workOrder->update($validated);

		return redirect()->route('work-orders.index')->with('message', 'Work order updated successfully.');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(WorkOrder $workOrder)
	{
		$workOrder->delete();

		return redirect()->route('work-orders.index')->with('message', 'Work order deleted successfully.');
	}

	/**
	 * Show the form for editing the status of the specified work order.
	 */
	public function editStatus(WorkOrder $workOrder)
	{
		return Inertia::render('work-orders/update-status', [
			'workOrder' => new WorkOrderResource($workOrder->load(['workOrderUpdates' => function ($query) {
				$query->latest()->take(1);
			}])),
		]);
	}

	/**
	 * Update the status and quantity of the specified work order.
	 */
	public function updateStatus(Request $request, WorkOrder $workOrder)
	{
		$validated = $request->validate([
			'status' => 'required|integer|in:' . implode(',', [WorkOrder::IN_PROGRESS, WorkOrder::COMPLETED]),
			'quantity_processed' => 'required|integer|min:1|max:' . $workOrder->quantity,
		]);

		WorkOrderUpdate::create([
			'work_order_id' => $workOrder->id,
			'user_id' => $request->user()->id,
			'previous_status' => $workOrder->status,
			'new_status' => $validated['status'],
			'quantity_processed' => $validated['quantity_processed'],
		]);

		$workOrder->update(['status' => $validated['status']]);

		return redirect()->route('work-orders.index')->with('message', 'Work order status updated successfully.');
	}

	/**
	 * Show the form for adding a progress note to the specified work order.
	 */
	public function editProgress(WorkOrder $workOrder)
	{
		return Inertia::render('work-orders/add-progress-note', [
			'workOrder' => new WorkOrderResource($workOrder),
		]);
	}

	/**
	 * Store a new progress note for the specified work order.
	 */
	public function storeProgress(Request $request, WorkOrder $workOrder)
	{
		// Validate work order status first
		if ($workOrder->status !== WorkOrder::IN_PROGRESS) {
			return redirect()->back()->with('error', 'Progress notes can only be added when work order is in progress.');
		}

		$validated = $request->validate([
			'progress_note' => 'required|string',
		]);

		WorkOrderProgress::create([
			'work_order_id' => $workOrder->id,
			'user_id' => $request->user()->id,
			'progress_notes' => $validated['progress_note'],
		]);

		return redirect()->route('work-orders.index')->with('message', 'Progress note added successfully.');
	}
}
