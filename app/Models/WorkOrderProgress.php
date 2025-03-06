<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkOrderProgress extends Model
{
	use SoftDeletes;

	protected $fillable = [
		'work_order_id',
		'user_id',
		'progress_notes'
	];

	public function workOrder()
	{
		return $this->belongsTo(WorkOrder::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
