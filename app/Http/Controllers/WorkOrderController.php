<?php

namespace App\Http\Controllers;

use App\Http\Resources\WorkOrderResource;
use App\Models\Product;
use App\Models\User;
use App\Models\WorkOrder;
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

		if ($request->has('deadline')) {
			$query->whereDate('deadline', $request->input('deadline'));
		}

		$workOrders = $query->paginate(10)->withQueryString();

		return Inertia::render('work-orders/index', [
			'workOrders' => WorkOrderResource::collection($workOrders),
			'filters' => $request->only(['status', 'deadline']),
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
	 * Show the form for editing the specified resource.
	 */
	public function edit(WorkOrder $workOrder)
	{
		$products = Product::all(['id', 'name']);
		$operatorRole = Role::where('name', 'Operator')->first();
		$users = User::role($operatorRole)->get(['id', 'name']);
		return Inertia::render('work-orders/edit', [
			'workOrder' => new WorkOrderResource($workOrder->load(['product', 'user']))->resolve(),
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
}
