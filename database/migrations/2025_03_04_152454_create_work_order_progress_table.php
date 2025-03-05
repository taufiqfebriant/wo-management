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
		Schema::create('work_order_progress', function (Blueprint $table) {
			$table->id();
			$table->foreignId('work_order_id')->constrained();
			$table->foreignId('user_id')->constrained();
			$table->text('progress_notes');
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('work_order_progress');
	}
};
