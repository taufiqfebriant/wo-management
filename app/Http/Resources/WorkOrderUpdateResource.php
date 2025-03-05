<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\WorkOrder;

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
			'previous_status' => $this->getStatusString($this->previous_status),
			'new_status' => $this->getStatusString($this->new_status),
			'quantity_processed' => $this->quantity_processed,
			'created_at' => $this->created_at->format('Y-m-d H:i:s'),
			'user' => new UserResource($this->whenLoaded('user')),
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
