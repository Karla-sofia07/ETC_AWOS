<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServicioRequest;
use App\Models\Servicio;
use Illuminate\Http\Request;

class ServicioController extends Controller
{
    public function index(Request $request)
    {
        $query = Servicio::query();

        if ($request->boolean('solo_activos')) {
            $query->where('activo', true);
        }

        return response()->json($query->orderBy('nombre')->get());
    }

    public function store(StoreServicioRequest $request)
    {
        $servicio = Servicio::create($request->validated());

        return response()->json([
            'message' => 'Servicio creado correctamente.',
            'servicio' => $servicio,
        ], 201);
    }

    public function show(Servicio $servicio)
    {
        return response()->json($servicio);
    }

    public function update(StoreServicioRequest $request, Servicio $servicio)
    {
        $servicio->update($request->validated());

        return response()->json([
            'message' => 'Servicio actualizado correctamente.',
            'servicio' => $servicio,
        ]);
    }

    public function destroy(Servicio $servicio)
    {
        $servicio->delete();

        return response()->json([
            'message' => 'Servicio eliminado correctamente.',
        ]);
    }
}
