<?php

namespace Database\Seeders;

use App\Models\Servicio;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@citas.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        Servicio::insert([
            [
                'nombre' => 'Consulta general',
                'descripcion' => 'Valoración inicial y diagnóstico',
                'duracion_minutos' => 30,
                'precio' => 250.00,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Seguimiento',
                'descripcion' => 'Cita de control y seguimiento',
                'duracion_minutos' => 20,
                'precio' => 150.00,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Consulta especializada',
                'descripcion' => 'Atención con especialista',
                'duracion_minutos' => 45,
                'precio' => 450.00,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
