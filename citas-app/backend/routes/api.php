<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CitaController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\ServicioController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rutas públicas
|--------------------------------------------------------------------------
*/
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Catálogo de servicios visible sin sesión (para mostrar antes de agendar)
Route::get('/servicios', [ServicioController::class, 'index']);
Route::get('/servicios/{servicio}', [ServicioController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Rutas protegidas (requieren token de Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Citas: cualquier usuario autenticado agenda, consulta y cancela las suyas
    Route::apiResource('citas', CitaController::class)->except(['destroy']);
    Route::delete('/citas/{cita}', [CitaController::class, 'destroy']); // cancelar

    /*
    |----------------------------------------------------------------------
    | Rutas solo para administradores
    |----------------------------------------------------------------------
    */
    Route::middleware('admin')->group(function () {
        Route::post('/servicios', [ServicioController::class, 'store']);
        Route::put('/servicios/{servicio}', [ServicioController::class, 'update']);
        Route::delete('/servicios/{servicio}', [ServicioController::class, 'destroy']);

        Route::get('/clientes', [ClienteController::class, 'index']);
        Route::get('/clientes/{cliente}', [ClienteController::class, 'show']);
        Route::get('/clientes/{cliente}/historial', [ClienteController::class, 'historial']);
    });
});
