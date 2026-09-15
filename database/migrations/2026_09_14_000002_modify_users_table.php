<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('shop_id')->nullable()->constrained('shops')->nullOnDelete()->after('id');
            $table->string('phone', 20)->nullable()->after('email');
            $table->boolean('is_super_admin')->default(false)->after('phone');
            $table->enum('status', ['active', 'inactive'])->default('active')->after('is_super_admin');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('shop_id');
            $table->dropColumn(['phone', 'is_super_admin', 'status', 'deleted_at']);
        });
    }
};
