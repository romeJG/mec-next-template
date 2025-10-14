<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminAccess = [
            "Dashboard" => [
                "icon" => "fa-solid fa-house",
                "route" => "/dashboard",
                "component" => "Dashboard",
                "root" => true,
                "sidebar" => false,
                "sort" => 0
            ],
            "User Administration" => [
                "icon" => "fa-solid fa-users-gear",
                "route" => "/user-administration",
                "component" => "UserAdministration",
                "root" => true,
                "sidebar" => true,
                "sort" => 1
            ],
            "sort" => 0
        ];

        // Insert or update Admin role
        DB::table('user_access')->updateOrInsert(
            ['role' => 'Admin'],
            [
                'role_access' => json_encode($adminAccess),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 👉 Call your AdminUserSeeder here
        $this->call(AdminUserSeeder::class);
    }
}
