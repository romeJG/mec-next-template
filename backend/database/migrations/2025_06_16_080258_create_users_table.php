<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->string('first_name', 30)->nullable();
            $table->string('middle_name', 30)->nullable();
            $table->string('last_name', 30)->nullable();
            $table->string('email', 255)->unique();
            $table->string('password', 255)->nullable();

            $table->string('department', 30)->nullable();
            $table->string('position', 30)->nullable();
            $table->unsignedTinyInteger('job_level')->nullable()->check('job_level <= 100');

            $table->string('profile_picture')->nullable();
            $table->string('profile_banner', 255)->nullable();

            $table->json('permissions')->nullable();
            $table->json('route_access')->nullable();
            $table->string('status', 30)->nullable();
            $table->boolean('account_terminated')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
