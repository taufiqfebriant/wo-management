<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\WorkOrder;

class WorkOrderResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'number' => $this->number,
			'product' => new ProductResource($this->whenLoaded('product')),
			'quantity' => $this->quantity,
			'deadline' => $this->deadline,
			'status' => $this->status,
			'user' => new UserResource($this->whenLoaded('user')),
			'created_at' => $this->created_at->format('Y-m-d H:i:s'),
			'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
			'work_order_progress' => WorkOrderProgressResource::collection($this->whenLoaded('workOrderProgress')),
			'work_order_updates' => WorkOrderUpdateResource::collection($this->whenLoaded('workOrderUpdates')),
		];
	}
}
