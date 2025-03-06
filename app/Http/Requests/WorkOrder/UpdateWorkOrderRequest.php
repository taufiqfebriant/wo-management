<?php

namespace App\Http\Requests\WorkOrder;

use App\Models\WorkOrder;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkOrderRequest extends FormRequest
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
		return [
			'product_id' => 'required|exists:products,id',
			'quantity' => 'required|integer|min:1',
			'deadline' => 'required|date',
			'status' => 'required|integer|in:' . implode(',', [
				WorkOrder::PENDING,
				WorkOrder::IN_PROGRESS,
				WorkOrder::COMPLETED,
				WorkOrder::CANCELED
			]),
			'user_id' => 'required|exists:users,id',
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
			'product_id' => 'Product',
			'quantity' => 'Quantity',
			'deadline' => 'Deadline',
			'status' => 'Status',
			'user_id' => 'Operator',
		];
	}
}
