<?php

namespace App\Http\Requests\WorkOrder;

use App\Models\WorkOrder;
use Illuminate\Foundation\Http\FormRequest;

class UpdateStatusWorkOrderRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 */
	public function authorize(): bool
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
	 */
	public function rules(): array
	{
		$allowedStatus = match ($this->workOrder->status) {
			WorkOrder::PENDING => [WorkOrder::IN_PROGRESS],
			WorkOrder::IN_PROGRESS => [WorkOrder::COMPLETED],
			default => [],
		};

		return [
			'status' => 'required|integer|in:' . implode(',', $allowedStatus),
			'quantity_processed' => 'required|integer|min:1|max:' . $this->workOrder->quantity,
		];
	}

	/**
	 * Get custom attributes for validator errors.
	 *
	 * @return array<string, string>
	 */
	public function attributes(): array
	{
		return [
			'status' => 'Status',
			'quantity_processed' => 'Processed Quantity',
		];
	}
}
