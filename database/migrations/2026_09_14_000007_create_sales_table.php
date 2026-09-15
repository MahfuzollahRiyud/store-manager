<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('invoice_no')->nullable();
            $table->date('sale_date');
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->decimal('due_amount', 15, 2)->default(0);
            $table->decimal('change_amount', 15, 2)->default(0);    // change returned to customer
            $table->decimal('total_cost', 15, 2)->default(0);       // total WAC cost of items sold
            $table->decimal('gross_profit', 15, 2)->default(0);     // total - total_cost - discount
            $table->string('payment_method', 50)->default('cash');
            $table->enum('status', ['pending', 'partial', 'paid'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('shop_id');
            $table->index(['shop_id', 'sale_date']);
            $table->index(['shop_id', 'customer_id']);
            $table->unique(['shop_id', 'invoice_no']);
        });

        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained('sales')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->decimal('quantity', 10, 2);
            $table->decimal('unit_price', 15, 2);               // selling price at time of sale
            $table->decimal('unit_cost', 15, 2);                // WAC cost snapshot at time of sale
            $table->decimal('subtotal', 15, 2);                 // qty × unit_price
            $table->decimal('profit', 15, 2);                   // (unit_price - unit_cost) × qty
            $table->timestamps();

            $table->index('sale_id');
            $table->index('product_id');
        });

        Schema::create('sale_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
            $table->foreignId('sale_id')->nullable()->constrained('sales')->nullOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('amount', 15, 2);
            $table->string('payment_method', 50)->default('cash');
            $table->date('payment_date');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['shop_id', 'customer_id']);
            $table->index(['shop_id', 'sale_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_payments');
        Schema::dropIfExists('sale_items');
        Schema::dropIfExists('sales');
    }
};
