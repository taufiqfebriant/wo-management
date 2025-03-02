<?php

namespace App\Http\Controllers;

use App\Http\Requests\Products\StoreProductRequest;
use App\Http\Requests\Products\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProductController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		$products = Product::orderBy('updated_at', 'desc')->orderBy('id', 'desc')->paginate(10);
		return Inertia::render('products/index', [
			'products' => ProductResource::collection($products),
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		return Inertia::render('products/create');
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreProductRequest $request)
	{
		Product::create($request->validated());

		return to_route('products.index')->with('message', 'Product created successfully.');
	}

	/**
	 * Display the specified resource.
	 */
	public function show(string $id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(Product $product)
	{
		return Inertia::render('products/edit', [
			'product' => new ProductResource($product)->resolve(),
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(UpdateProductRequest $request, Product $product)
	{
		$product->update($request->validated());

		return to_route('products.index')->with('message', 'Product updated successfully.');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Product $product)
	{
		$product->delete();

		return to_route('products.index')->with('message', 'Product deleted successfully.');
	}
}
