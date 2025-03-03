<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::create('work_orders', function (Blueprint $table) {
			$table->id();
			$table->string('number')->unique();
			$table->foreignId('product_id')->constrained();
			$table->integer('quantity');
			$table->date('deadline');
			$table->unsignedTinyInteger('status');
			$table->foreignId('user_id')->constrained('users');
			$table->timestamps();
			$table->softDeletes();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('work_orders');
	}
};
