<?php

namespace App\Http\Controllers;

use App\Http\Requests\WorkOrder\StoreWorkOrderRequest;
use App\Http\Requests\WorkOrder\UpdateWorkOrderRequest;
use App\Http\Requests\WorkOrder\UpdateStatusWorkOrderRequest;
use App\Http\Requests\WorkOrder\StoreProgressWorkOrderRequest;
use App\Http\Resources\ProductResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\WorkOrderResource;
use App\Http\Resources\WorkOrderUpdateResource;
use App\Models\Product;
use App\Models\User;
use App\Models\WorkOrder;
use App\Models\WorkOrderProgress;
use App\Models\WorkOrderUpdate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

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
		$products = Product::get();
		$operatorRole = Role::where('name', 'Operator')->first();
		$users = User::role($operatorRole)->get();

		return Inertia::render('work-orders/create', [
			'products' => ProductResource::collection($products),
			'users' => UserResource::collection($users),
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreWorkOrderRequest $request)
	{
		$validated = $request->validated();

		$number = 'WO-' . now()->format('Ymd') . '-' . str_pad(WorkOrder::withTrashed()->count() + 1, 3, '0', STR_PAD_LEFT);

		$workOrder = DB::transaction(function () use ($number, $validated, $request) {
			$workOrder = WorkOrder::create([
				'number' => $number,
				'product_id' => $validated['product_id'],
				'quantity' => $validated['quantity'],
				'deadline' => $validated['deadline'],
				'status' => WorkOrder::PENDING,
				'user_id' => $validated['user_id'],
			]);

			WorkOrderUpdate::create([
				'work_order_id' => $workOrder->id,
				'user_id' => $request->user()->id,
				'previous_status' => WorkOrder::PENDING,
				'new_status' => WorkOrder::PENDING,
				'quantity_processed' => $validated['quantity'],
			]);

			return $workOrder;
		});

		return to_route('work-orders.show', $workOrder)->with('message', 'Work order created successfully.');
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
		$products = Product::get();
		$operatorRole = Role::where('name', 'Operator')->first();
		$users = User::role($operatorRole)->get();

		return Inertia::render('work-orders/edit', [
			'workOrder' => new WorkOrderResource($workOrder->load(['product', 'user'])),
			'products' => ProductResource::collection($products),
			'users' => UserResource::collection($users),
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(UpdateWorkOrderRequest $request, WorkOrder $workOrder)
	{
		$validated = $request->validated();

		DB::transaction(function () use ($workOrder, $validated, $request) {
			$previousStatus = $workOrder->status;

			$workOrder->update($validated);

			WorkOrderUpdate::create([
				'work_order_id' => $workOrder->id,
				'user_id' => $request->user()->id,
				'previous_status' => $previousStatus,
				'new_status' => $validated['status'],
				'quantity_processed' => $validated['quantity'],
			]);
		});

		return to_route('work-orders.show', $workOrder)->with('message', 'Work order updated successfully.');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(WorkOrder $workOrder)
	{
		DB::transaction(function () use ($workOrder) {
			$workOrder->workOrderUpdates()->delete();

			$workOrder->workOrderProgress()->delete();

			$workOrder->delete();
		});

		return to_route('work-orders.index')->with('message', 'Work order deleted successfully.');
	}

	/**
	 * Show the form for editing the status of the specified work order.
	 */
	public function editStatus(WorkOrder $workOrder)
	{
		return Inertia::render('work-orders/update-status', [
			'workOrderUpdate' => new WorkOrderUpdateResource($workOrder->workOrderUpdates()->latest()->first()->load(['workOrder'])),
		]);
	}

	/**
	 * Update the status and quantity of the specified work order.
	 */
	public function updateStatus(UpdateStatusWorkOrderRequest $request, WorkOrder $workOrder)
	{
		$validated = $request->validated();

		WorkOrderUpdate::create([
			'work_order_id' => $workOrder->id,
			'user_id' => $request->user()->id,
			'previous_status' => $workOrder->status,
			'new_status' => $validated['status'],
			'quantity_processed' => $validated['quantity_processed'],
		]);

		$workOrder->update(['status' => $validated['status']]);

		return to_route('work-orders.show', $workOrder)->with('message', 'Work order status updated successfully.');
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
	public function storeProgress(StoreProgressWorkOrderRequest $request, WorkOrder $workOrder)
	{
		if ($workOrder->status !== WorkOrder::IN_PROGRESS) {
			return to_route('work-orders.index')->with('message', 'Progress notes can only be added when work order is in progress.');
		}

		$validated = $request->validated();

		WorkOrderProgress::create([
			'work_order_id' => $workOrder->id,
			'user_id' => $request->user()->id,
			'progress_notes' => $validated['progress_note'],
		]);

		return to_route('work-orders.show', $workOrder)->with('message', 'Progress note added successfully.');
	}
}
