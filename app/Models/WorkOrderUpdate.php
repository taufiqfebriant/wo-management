<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkOrderUpdate extends Model
{
	use SoftDeletes;

	protected $fillable = ['work_order_id', 'user_id', 'previous_status', 'new_status', 'quantity_processed'];

	public function workOrder()
	{
		return $this->belongsTo(WorkOrder::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
