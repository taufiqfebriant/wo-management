<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\WorkOrder;
use App\Models\User;
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
			DB::raw('COUNT(DISTINCT CASE WHEN wou.new_status = ' . WorkOrder::PENDING . ' THEN work_orders.id END) as pending_count'),
			DB::raw('SUM(CASE WHEN wou.new_status = ' . WorkOrder::PENDING . ' THEN wou.quantity_processed END) as pending_quantity'),
			DB::raw('COUNT(DISTINCT CASE WHEN wou.new_status = ' . WorkOrder::IN_PROGRESS . ' THEN work_orders.id END) as in_progress_count'),
			DB::raw('SUM(CASE WHEN wou.new_status = ' . WorkOrder::IN_PROGRESS . ' THEN wou.quantity_processed END) as in_progress_quantity'),
			DB::raw('COUNT(DISTINCT CASE WHEN wou.new_status = ' . WorkOrder::COMPLETED . ' THEN work_orders.id END) as completed_count'),
			DB::raw('SUM(CASE WHEN wou.new_status = ' . WorkOrder::COMPLETED . ' THEN wou.quantity_processed END) as completed_quantity'),
			DB::raw('COUNT(DISTINCT CASE WHEN wou.new_status = ' . WorkOrder::CANCELED . ' THEN work_orders.id END) as canceled_count'),
			DB::raw('SUM(CASE WHEN wou.new_status = ' . WorkOrder::CANCELED . ' THEN wou.quantity_processed END) as canceled_quantity')
		)
			->leftJoin('work_orders', 'products.id', '=', 'work_orders.product_id')
			->leftJoin('work_order_updates as wou', 'work_orders.id', '=', 'wou.work_order_id')
			->whereNull('products.deleted_at')
			->whereNull('work_orders.deleted_at')
			->whereNull('wou.deleted_at')
			->groupBy('products.id', 'products.name')
			->orderBy('products.name')
			->paginate(10);

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
				DB::raw('COUNT(DISTINCT CASE WHEN wou.new_status = ' . WorkOrder::COMPLETED . ' THEN work_orders.id END) as completed_orders'),
				DB::raw('SUM(CASE WHEN wou.new_status = ' . WorkOrder::COMPLETED . ' THEN wou.quantity_processed END) as completed_quantity')
			)
			->leftJoin('work_orders', function ($join) {
				$join->on('users.id', '=', 'work_orders.user_id')
					->whereNull('work_orders.deleted_at');
			})
			->leftJoin('work_order_updates as wou', function ($join) {
				$join->on('work_orders.id', '=', 'wou.work_order_id')
					->whereNull('wou.deleted_at');
			})
			->leftJoin('products', function ($join) {
				$join->on('work_orders.product_id', '=', 'products.id')
					->whereNull('products.deleted_at');
			})
			->groupBy('users.id', 'users.name', 'products.id', 'products.name')
			->orderBy('users.name')
			->orderBy('products.name')
			->paginate(10);

		return Inertia::render('reports/operator-performance', [
			'performance' => $performance
		]);
	}
}
