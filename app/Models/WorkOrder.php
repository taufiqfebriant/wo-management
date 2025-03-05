<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkOrder extends Model
{
	use SoftDeletes;

	const PENDING = 0;
	const IN_PROGRESS = 1;
	const COMPLETED = 2;
	const CANCELED = 3;

	protected $fillable = [
		'number',
		'product_id',
		'quantity',
		'deadline',
		'status',
		'user_id',
	];

	public function product()
	{
		return $this->belongsTo(Product::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function workOrderUpdates()
	{
		return $this->hasMany(WorkOrderUpdate::class);
	}

	public function workOrderProgress()
	{
		return $this->hasMany(WorkOrderProgress::class);
	}
}
