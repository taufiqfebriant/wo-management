<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\WorkOrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
	Route::get('/', function () {
		return Inertia::render('dashboard', [
			'appName' => config('app.name')
		]);
	})->name('dashboard');

	Route::prefix('products')->name('products.')->group(function () {
		Route::get('/', [ProductController::class, 'index'])
			->middleware('permission:read products')
			->name('index');

		Route::get('/create', [ProductController::class, 'create'])
			->middleware('permission:create products')
			->name('create');

		Route::post('/', [ProductController::class, 'store'])
			->middleware('permission:create products')
			->name('store');

		Route::get('/{product}', [ProductController::class, 'show'])
			->middleware('permission:read product')
			->name('show');

		Route::get('/{product}/edit', [ProductController::class, 'edit'])
			->middleware('permission:update products')
			->name('edit');

		Route::put('/{product}', [ProductController::class, 'update'])
			->middleware('permission:update products')
			->name('update');

		Route::delete('/{product}', [ProductController::class, 'destroy'])
			->middleware('permission:delete products')
			->name('destroy');
	});

	Route::prefix('work-orders')->name('work-orders.')->group(function () {
		Route::get('/', [WorkOrderController::class, 'index'])
			->middleware('permission:read work orders')
			->name('index');

		Route::get('/create', [WorkOrderController::class, 'create'])
			->middleware('permission:create work orders')
			->name('create');

		Route::post('/', [WorkOrderController::class, 'store'])
			->middleware('permission:create work orders')
			->name('store');

		Route::get('/{workOrder}', [WorkOrderController::class, 'show'])
			->middleware('permission:read work order')
			->name('show');

		Route::get('/{workOrder}/edit', [WorkOrderController::class, 'edit'])
			->middleware('permission:update work orders')
			->name('edit');

		Route::put('/{workOrder}', [WorkOrderController::class, 'update'])
			->middleware('permission:update work orders')
			->name('update');

		Route::delete('/{workOrder}', [WorkOrderController::class, 'destroy'])
			->middleware('permission:delete work orders')
			->name('destroy');

		Route::get('/{workOrder}/update-status', [WorkOrderController::class, 'editStatus'])
			->middleware('permission:update work order status')
			->name('edit-status');

		Route::patch('/{workOrder}/update-status', [WorkOrderController::class, 'updateStatus'])
			->middleware('permission:update work order status')
			->name('update-status');

		Route::get('/{workOrder}/add-progress-note', [WorkOrderController::class, 'editProgress'])
			->middleware('permission:create work order progress notes')
			->name('edit-progress');

		Route::post('/{workOrder}/store-progress', [WorkOrderController::class, 'storeProgress'])
			->middleware('permission:create work order progress notes')
			->name('store-progress');
	});

	Route::prefix('reports')->name('reports.')->group(function () {
		Route::get('work-order-summary', [ReportController::class, 'workOrderSummary'])
			->middleware('permission:read work order summary report')
			->name('work-order-summary');

		Route::get('operator-performance', [ReportController::class, 'operatorPerformance'])
			->middleware('permission:read operator performance report')
			->name('operator-performance');
	});
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
