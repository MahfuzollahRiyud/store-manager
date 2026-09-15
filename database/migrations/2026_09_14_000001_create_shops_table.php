<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->string('name');                         // Shop/Business name
            $table->string('owner_name');
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('logo')->nullable();             // relative path
            $table->string('currency', 10)->default('BDT');
            $table->string('currency_symbol', 10)->default('৳');
            $table->string('invoice_prefix', 20)->default('INV-');
            $table->boolean('is_active')->default(true);
            $table->json('settings')->nullable();           // flexible settings bag
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
