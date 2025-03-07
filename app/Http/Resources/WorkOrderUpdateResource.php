<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkOrderUpdateResource extends JsonResource
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
			'previous_status' => $this->previous_status,
			'new_status' => $this->new_status,
			'quantity_processed' => $this->quantity_processed,
			'created_at' => $this->created_at->format('Y-m-d H:i:s'),
			'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
			'user' => new UserResource($this->whenLoaded('user')),
			'work_order' => new WorkOrderResource($this->whenLoaded('workOrder')),
		];
	}
}
