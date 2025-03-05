<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\WorkOrder;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class ReportController extends Controller
{
	/**
	 * Display work order summary report.
	 */
	public function workOrderSummary()
	{
		$summary = Product::select(
			'products.name as product_name',
			DB::raw('COUNT(CASE WHEN work_orders.status = ' . WorkOrder::PENDING . ' THEN 1 END) as pending_count'),
			DB::raw('COUNT(CASE WHEN work_orders.status = ' . WorkOrder::IN_PROGRESS . ' THEN 1 END) as in_progress_count'),
			DB::raw('COUNT(CASE WHEN work_orders.status = ' . WorkOrder::COMPLETED . ' THEN 1 END) as completed_count'),
			DB::raw('COUNT(CASE WHEN work_orders.status = ' . WorkOrder::CANCELED . ' THEN 1 END) as canceled_count'),
			DB::raw('SUM(CASE WHEN work_orders.status = ' . WorkOrder::PENDING . ' THEN work_orders.quantity END) as pending_quantity'),
			DB::raw('SUM(CASE WHEN work_orders.status = ' . WorkOrder::IN_PROGRESS . ' THEN work_orders.quantity END) as in_progress_quantity'),
			DB::raw('SUM(CASE WHEN work_orders.status = ' . WorkOrder::COMPLETED . ' THEN work_orders.quantity END) as completed_quantity'),
			DB::raw('SUM(CASE WHEN work_orders.status = ' . WorkOrder::CANCELED . ' THEN work_orders.quantity END) as canceled_quantity')
		)
			->leftJoin('work_orders', 'products.id', '=', 'work_orders.product_id')
			->groupBy('products.id', 'products.name')
			->orderBy('products.name')
			->get();

		return Inertia::render('reports/work-order-summary', [
			'summary' => $summary
		]);
	}

	/**
	 * Display operator performance report.
	 */
	public function operatorPerformance()
	{
		$operatorRole = Role::where('name', 'Operator')->first();

		$performance = User::role($operatorRole)
			->select(
				'users.name as operator_name',
				'products.name as product_name',
				DB::raw('COUNT(DISTINCT CASE WHEN work_orders.status = ' . WorkOrder::COMPLETED . ' THEN work_orders.id END) as completed_orders'),
				DB::raw('SUM(CASE WHEN work_orders.status = ' . WorkOrder::COMPLETED . ' THEN work_orders.quantity END) as completed_quantity')
			)
			->leftJoin('work_orders', 'users.id', '=', 'work_orders.user_id')
			->leftJoin('products', 'work_orders.product_id', '=', 'products.id')
			->groupBy('users.id', 'users.name', 'products.id', 'products.name')
			->orderBy('users.name')
			->orderBy('products.name')
			->get();

		return Inertia::render('reports/operator-performance', [
			'performance' => $performance
		]);
	}
}
