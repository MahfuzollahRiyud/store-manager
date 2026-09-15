<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('unit_id')->nullable()->constrained('units')->nullOnDelete();
            $table->string('name');
            $table->string('sku')->nullable();
            $table->string('barcode')->nullable();
            $table->string('brand')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            // Financial — always DECIMAL, never FLOAT
            $table->decimal('purchase_price', 15, 2)->default(0);   // last purchase price
            $table->decimal('selling_price', 15, 2)->default(0);
            $table->decimal('avg_cost', 15, 2)->default(0);         // weighted average cost
            // Stock
            $table->decimal('current_stock', 10, 2)->default(0);
            $table->decimal('min_stock_level', 10, 2)->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
            $table->softDeletes();

            $table->index('shop_id');
            $table->index(['shop_id', 'status']);
            $table->index(['shop_id', 'current_stock']);
            $table->unique(['shop_id', 'sku']); // SKU unique per shop
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
