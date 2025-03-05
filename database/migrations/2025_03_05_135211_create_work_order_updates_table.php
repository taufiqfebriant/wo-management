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
		Schema::create('work_order_updates', function (Blueprint $table) {
			$table->id();
			$table->foreignId('work_order_id')->constrained();
			$table->foreignId('user_id')->constrained();
			$table->unsignedTinyInteger('previous_status');
			$table->unsignedTinyInteger('new_status');
			$table->unsignedInteger('quantity_processed')->nullable();
			$table->timestamps();
			$table->softDeletes();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('work_order_updates');
	}
};
