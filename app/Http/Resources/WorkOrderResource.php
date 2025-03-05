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
			'status' => $this->getStatusString($this->status),
			'operator' => new UserResource($this->whenLoaded('user')),
			'created_at' => $this->created_at->format('Y-m-d H:i:s'),
			'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
			'latest_quantity' => $this->latest_quantity ?? $this->quantity,
			'work_order_progress' => WorkOrderProgressResource::collection($this->whenLoaded('workOrderProgress')),
			'work_order_updates' => WorkOrderUpdateResource::collection($this->whenLoaded('workOrderUpdates')),
		];
	}

	/**
	 * Get the string representation of the status.
	 *
	 * @param int $status
	 * @return string
	 */
	protected function getStatusString(int $status): string
	{
		switch ($status) {
			case WorkOrder::IN_PROGRESS:
				return 'In Progress';
			case WorkOrder::COMPLETED:
				return 'Completed';
			case WorkOrder::CANCELED:
				return 'Canceled';
			case WorkOrder::PENDING:
			default:
				return 'Pending';
		}
	}
}
