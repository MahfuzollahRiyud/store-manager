<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('type', [
                'purchase',
                'sale',
                'return_in',        // customer sale return — stock comes back in
                'return_out',       // purchase return — stock goes out
                'adjustment_increase',
                'adjustment_decrease',
                'damage',
                'loss',
                'opening_stock',
            ]);
            $table->decimal('quantity', 10, 2);         // positive = in, negative = out
            $table->decimal('unit_cost', 15, 2)->default(0);
            // Polymorphic reference to the source (Purchase, Sale, StockAdjustment, etc.)
            $table->nullableMorphs('reference');
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('shop_id');
            $table->index(['shop_id', 'product_id']);
            $table->index(['shop_id', 'type']);
            $table->index(['shop_id', 'created_at']);
        });

        Schema::create('stock_adjustments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('system_qty', 10, 2);       // stock quantity before adjustment
            $table->decimal('physical_qty', 10, 2);     // physically counted quantity
            $table->decimal('adjustment_qty', 10, 2);   // difference (positive or negative)
            $table->enum('type', ['increase', 'decrease']);
            $table->string('reason');                   // mandatory reason
            $table->timestamps();

            $table->index(['shop_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_adjustments');
        Schema::dropIfExists('stock_movements');
    }
};
