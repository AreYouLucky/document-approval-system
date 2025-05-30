<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = [
            [
                'full_name' => 'John Michael Cagadas',
                'qms_role' => 'Super Admin',
                'email' => 'johnmichaelcagadas@gmail.com',
                'username' => 'super',
                'password' => Hash::make('aa'),
                'division' => '1',
                'position' => 'Computer Programmer II'
            ],
            [
                'full_name' => 'Document Custodian',
                'qms_role' => 'Document Custodian',
                'email' => 'johnmichaelcagadas@gmail.com',
                'position' => 'Project Assistant II',
                'username' => 'document',
                'password' => Hash::make('aa'),
                'division' => '1',
            ],
            [
                'full_name' => 'Additional Document Custodian',
                'qms_role' => 'Document Custodian',
                'email' => 'johnmichaelcagadas@gmail.com',
                'position' => 'Project Assistant II',
                'username' => 'document2',
                'password' => Hash::make('aa'),
                'division' => '1',
            ],
            [
                'full_name' => 'Division Chief',
                'qms_role' => 'Division Chief',
                'email' => 'johnmichaelcagadas@gmail.com',
                'position' => 'ITU Head',
                'username' => 'chief',
                'password' => Hash::make('aa'),
                'division' => '1',
            ],
            [
                'full_name' => 'Division Chief 2',
                'qms_role' => 'Division Chief',
                'email' => 'johnmichaelcagadas@gmail.com',
                'position' => 'HR Head',
                'username' => 'chief2',
                'password' => Hash::make('aa'),
                'division' => '2',
            ],
            [
                'full_name' => 'Division Chief 3',
                'qms_role' => 'Division Chief',
                'email' => 'johnmichaelcagadas@gmail.com',
                'position' => 'Finance Head',
                'username' => 'chief3',
                'password' => Hash::make('aa'),
                'division' => '3',
            ],
            [
                'full_name' => 'Division Chief 4',
                'qms_role' => 'Division Chief',
                'email' => 'johnmichaelcagadas@gmail.com',
                'position' => 'Admin Head',
                'username' => 'chief4',
                'password' => Hash::make('aa'),
                'division' => '4',
            ],
            [
                'full_name' => 'QMR',
                'qms_role' => 'QMR',
                'email' => 'johnmichaelcagadas@gmail.com',
                'position' => 'FAD Chief',
                'username' => 'qmr',
                'password' => Hash::make('aa'),
                'division' => '1',
            ],
        ];

        // Adding 12 Process Owners
        for ($i = 1; $i <= 12; $i++) {
            $admin[] = [
                'full_name' => "Process Owner $i",
                'qms_role' => 'Process Owner',
                'username' => "process$i",
                'position' => 'Science Research Specialist II',
                'email' => 'johnmichaelcagadas@gmail.com',
                'password' => Hash::make('aa'),
                'division' => '1',
            ];
        }


        \App\Models\User::insertOrIgnore($admin);

    }
}
