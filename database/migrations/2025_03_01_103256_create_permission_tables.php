<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		$teams = config('permission.teams');
		$tableNames = config('permission.table_names');
		$columnNames = config('permission.column_names');
		$pivotRole = $columnNames['role_pivot_key'] ?? 'role_id';
		$pivotPermission = $columnNames['permission_pivot_key'] ?? 'permission_id';

		if (empty($tableNames)) {
			throw new \Exception('Error: config/permission.php not loaded. Run [php artisan config:clear] and try again.');
		}
		if ($teams && empty($columnNames['team_foreign_key'] ?? null)) {
			throw new \Exception('Error: team_foreign_key on config/permission.php not loaded. Run [php artisan config:clear] and try again.');
		}

		Schema::create($tableNames['permissions'], static function (Blueprint $table) {
			$table->bigIncrements('id'); // permission id
			$table->string('name');       // For MyISAM use string('name', 225); // (or 166 for InnoDB with Redundant/Compact row format)
			$table->string('guard_name'); // For MyISAM use string('guard_name', 25);
			$table->timestamps();

			$table->unique(['name', 'guard_name']);
		});

		Schema::create($tableNames['roles'], static function (Blueprint $table) use ($teams, $columnNames) {
			$table->bigIncrements('id'); // role id
			if ($teams || config('permission.testing')) { // permission.testing is a fix for sqlite testing
				$table->unsignedBigInteger($columnNames['team_foreign_key'])->nullable();
				$table->index($columnNames['team_foreign_key'], 'roles_team_foreign_key_index');
			}
			$table->string('name');       // For MyISAM use string('name', 225); // (or 166 for InnoDB with Redundant/Compact row format)
			$table->string('guard_name'); // For MyISAM use string('guard_name', 25);
			$table->timestamps();
			if ($teams || config('permission.testing')) {
				$table->unique([$columnNames['team_foreign_key'], 'name', 'guard_name']);
			} else {
				$table->unique(['name', 'guard_name']);
			}
		});

		Schema::create($tableNames['model_has_permissions'], static function (Blueprint $table) use ($tableNames, $columnNames, $pivotPermission, $teams) {
			$table->unsignedBigInteger($pivotPermission);

			$table->string('model_type');
			$table->unsignedBigInteger($columnNames['model_morph_key']);
			$table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_permissions_model_id_model_type_index');

			$table->foreign($pivotPermission)
				->references('id') // permission id
				->on($tableNames['permissions'])
				->onDelete('cascade');
			if ($teams) {
				$table->unsignedBigInteger($columnNames['team_foreign_key']);
				$table->index($columnNames['team_foreign_key'], 'model_has_permissions_team_foreign_key_index');

				$table->primary(
					[$columnNames['team_foreign_key'], $pivotPermission, $columnNames['model_morph_key'], 'model_type'],
					'model_has_permissions_permission_model_type_primary'
				);
			} else {
				$table->primary(
					[$pivotPermission, $columnNames['model_morph_key'], 'model_type'],
					'model_has_permissions_permission_model_type_primary'
				);
			}
		});

		Schema::create($tableNames['model_has_roles'], static function (Blueprint $table) use ($tableNames, $columnNames, $pivotRole, $teams) {
			$table->unsignedBigInteger($pivotRole);

			$table->string('model_type');
			$table->unsignedBigInteger($columnNames['model_morph_key']);
			$table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_roles_model_id_model_type_index');

			$table->foreign($pivotRole)
				->references('id') // role id
				->on($tableNames['roles'])
				->onDelete('cascade');
			if ($teams) {
				$table->unsignedBigInteger($columnNames['team_foreign_key']);
				$table->index($columnNames['team_foreign_key'], 'model_has_roles_team_foreign_key_index');

				$table->primary(
					[$columnNames['team_foreign_key'], $pivotRole, $columnNames['model_morph_key'], 'model_type'],
					'model_has_roles_role_model_type_primary'
				);
			} else {
				$table->primary(
					[$pivotRole, $columnNames['model_morph_key'], 'model_type'],
					'model_has_roles_role_model_type_primary'
				);
			}
		});

		Schema::create($tableNames['role_has_permissions'], static function (Blueprint $table) use ($tableNames, $pivotRole, $pivotPermission) {
			$table->unsignedBigInteger($pivotPermission);
			$table->unsignedBigInteger($pivotRole);

			$table->foreign($pivotPermission)
				->references('id') // permission id
				->on($tableNames['permissions'])
				->onDelete('cascade');

			$table->foreign($pivotRole)
				->references('id') // role id
				->on($tableNames['roles'])
				->onDelete('cascade');

			$table->primary([$pivotPermission, $pivotRole], 'role_has_permissions_permission_id_role_id_primary');
		});

		$now = now();

		DB::table($tableNames['roles'])->insert([
			['name' => 'Production Manager', 'guard_name' => 'web', 'created_at' => $now],
			['name' => 'Operator', 'guard_name' => 'web', 'created_at' => $now],
		]);

		DB::table($tableNames['permissions'])->insert([
			['name' => 'read products', 'guard_name' => 'web', 'created_at' => $now],
			['name' => 'create products', 'guard_name' => 'web', 'created_at' => $now],
			['name' => 'update products', 'guard_name' => 'web', 'created_at' => $now],
			['name' => 'delete products', 'guard_name' => 'web', 'created_at' => $now],
			['name' => 'read product', 'guard_name' => 'web', 'created_at' => $now],
			['name' => 'read work orders', 'guard_name' => 'web', 'created_at' => $now],
			['name' => 'create work orders', 'guard_name' => 'web', 'created_at' => $now],
			['name' => 'update work orders', 'guard_name' => 'web', 'created_at' => $now],
			['name' => 'delete work orders', 'guard_name' => 'web', 'created_at' => $now],
			['name' => 'read work order', 'guard_name' => 'web', 'created_at' => $now],
			['name' => 'read work order summary report', 'guard_name' => 'web', 'created_at' => $now],
			['name' => 'read operator performance report', 'guard_name' => 'web', 'created_at' => $now],
			['name' => 'update work order status', 'guard_name' => 'web', 'created_at' => $now],
			['name' => 'create work order progress notes', 'guard_name' => 'web', 'created_at' => $now],
		]);

		$rolePermissions = [
			'Production Manager' => [
				'read products',
				'create products',
				'update products',
				'delete products',
				'read product',
				'read work orders',
				'create work orders',
				'update work orders',
				'delete work orders',
				'read work order',
				'read work order summary report',
				'read operator performance report',
			],
			'Operator' => [
				'read work orders',
				'read work order',
				'update work order status',
				'create work order progress notes',
			],
		];

		foreach ($rolePermissions as $role => $permissions) {
			$roleId = DB::table($tableNames['roles'])->where('name', $role)->value('id');
			foreach ($permissions as $permission) {
				$permissionId = DB::table($tableNames['permissions'])->where('name', $permission)->value('id');
				DB::table($tableNames['role_has_permissions'])->insert([
					'role_id' => $roleId,
					'permission_id' => $permissionId,
				]);
			}
		}

		$users = [
			[
				'name' => 'Production Manager User',
				'email' => 'manager@example.com',
				'password' => Hash::make('password'),
				'created_at' => $now,
			],
			[
				'name' => 'Operator User',
				'email' => 'operator@example.com',
				'password' => Hash::make('password'),
				'created_at' => $now,
			],
			[
				'name' => 'Operator User 2',
				'email' => 'operator2@example.com',
				'password' => Hash::make('password'),
				'created_at' => $now,
			],
		];

		foreach ($users as $user) {
			$userId = DB::table('users')->insertGetId($user);
			$roleId = DB::table($tableNames['roles'])->where('name', $user['name'] === 'Production Manager User' ? 'Production Manager' : 'Operator')->value('id');
			DB::table($tableNames['model_has_roles'])->insert([
				'role_id' => $roleId,
				'model_type' => 'App\Models\User',
				'model_id' => $userId,
			]);
		}

		app('cache')
			->store(config('permission.cache.store') != 'default' ? config('permission.cache.store') : null)
			->forget(config('permission.cache.key'));
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		$tableNames = config('permission.table_names');

		if (empty($tableNames)) {
			throw new \Exception('Error: config/permission.php not found and defaults could not be merged. Please publish the package configuration before proceeding, or drop the tables manually.');
		}

		Schema::drop($tableNames['role_has_permissions']);
		Schema::drop($tableNames['model_has_roles']);
		Schema::drop($tableNames['model_has_permissions']);
		Schema::drop($tableNames['roles']);
		Schema::drop($tableNames['permissions']);
	}
};
