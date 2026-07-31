<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    // Lista de clientes (solo admin, ver rutas protegidas)
    public function index(Request $request)
    {
        $query = User::where('role', 'cliente');

        if ($request->filled('buscar')) {
            $buscar = $request->input('buscar');
            $query->where(function ($q) use ($buscar) {
                $q->where('name', 'like', "%{$buscar}%")
                  ->orWhere('email', 'like', "%{$buscar}%");
            });
        }

        return response()->json($query->orderBy('name')->get());
    }

    public function show(User $cliente)
    {
        return response()->json($cliente->load('citas.servicio'));
    }

    // Historial de citas de un cliente específico
    public function historial(User $cliente)
    {
        $citas = $cliente->citas()
            ->with('servicio')
            ->orderByDesc('fecha')
            ->orderByDesc('hora')
            ->get();

        return response()->json($citas);
    }
}
