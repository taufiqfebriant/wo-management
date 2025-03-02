<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\WorkOrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
	Route::get('/', function () {
		return Inertia::render('dashboard');
	})->name('dashboard');

	Route::resource('products', ProductController::class);
	Route::resource('work-orders', WorkOrderController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
