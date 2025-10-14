<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminUserSeeder extends Seeder
{

    /**
     * Run the database seeds.
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
        DB::table('users')->updateOrInsert(
            ['email' => 'j.guillermo@mec.ph'], //! Change this to your email OTP will be sent to this email
            [
                'first_name' => 'Admin',
                'middle_name' => '',
                'last_name' => 'Account',
                'email' => 'j.guillermo@mec.ph', //! Change this to your email OTP will be sent to this email
                'password' => Hash::make('asd@123123'),

                'department' => 'Software Development',
                'position' => 'Administrator',
                'job_level' => 100,

                'profile_picture' => null,
                'profile_banner' => "profile-banner-gradient",

                'permissions' => json_encode(['admin', 'super admin']),
                'route_access' => json_encode(["Admin" => $adminAccess]),
                'status' => 'active',
                'account_terminated' => 0,

                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
