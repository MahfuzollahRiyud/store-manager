<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

/**
 * Creates a new shop and its owner user in a single atomic transaction.
 * This is the entry point for shop registration in the SaaS.
 */
class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user and their shop.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'shop_name' => ['required', 'string', 'max:255'],
            'name'      => ['required', 'string', 'max:255'],
            'phone'     => ['required', 'string', 'max:20'],
            'email'     => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'  => $this->passwordRules(),
        ], [
            'shop_name.required' => 'Shop name is required.',
            'phone.required'     => 'Phone number is required.',
        ])->validate();

        return DB::transaction(function () use ($input): User {
            // 1. Create the Shop (tenant)
            $shop = Shop::create([
                'name'       => $input['shop_name'],
                'owner_name' => $input['name'],
                'phone'      => $input['phone'],
                'email'      => $input['email'],
                'currency'         => 'BDT',
                'currency_symbol'  => '৳',
                'invoice_prefix'   => 'INV-',
                'is_active'        => true,
            ]);

            // 2. Create the owner User and attach to the shop
            $user = User::create([
                'shop_id'  => $shop->id,
                'name'     => $input['name'],
                'email'    => $input['email'],
                'phone'    => $input['phone'],
                'password' => $input['password'],
                'status'   => 'active',
            ]);

            // 3. Assign shop_owner role
            $user->assignRole('shop_owner');

            return $user;
        });
    }
}
