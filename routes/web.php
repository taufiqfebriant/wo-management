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

	Route::resource('products', ProductController::class);
	Route::resource('work-orders', WorkOrderController::class);

	Route::get('work-orders/{workOrder}/update-status', [WorkOrderController::class, 'editStatus'])->name('work-orders.edit-status');
	Route::patch('work-orders/{workOrder}/update-status', [WorkOrderController::class, 'updateStatus'])->name('work-orders.update-status');
	Route::get('work-orders/{workOrder}/add-progress-note', [WorkOrderController::class, 'editProgress'])->name('work-orders.edit-progress');
	Route::post('work-orders/{workOrder}/store-progress', [WorkOrderController::class, 'storeProgress'])->name('work-orders.store-progress');

	Route::prefix('reports')->name('reports.')->group(function () {
		Route::get('work-order-summary', [ReportController::class, 'workOrderSummary'])
			->name('work-order-summary');
		Route::get('operator-performance', [ReportController::class, 'operatorPerformance'])
			->name('operator-performance');
	});
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
