<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@storemanager.app'],
            [
                'shop_id'        => null,
                'name'           => 'Super Admin',
                'email'          => 'admin@storemanager.app',
                'phone'          => '01700-000000',
                'password'       => Hash::make('admin123'),
                'is_super_admin' => true,
                'status'         => 'active',
            ]
        );

        $superAdmin->assignRole('super_admin');
    }
}
