<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCitaRequest;
use App\Models\Cita;
use Illuminate\Http\Request;

class CitaController extends Controller
{
    // GET /api/citas?fecha=2026-08-01
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Cita::with(['cliente', 'servicio']);

        // Un cliente normal solo ve sus propias citas; el admin ve todas
        if (! $user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('fecha')) {
            $query->whereDate('fecha', $request->input('fecha'));
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->input('estado'));
        }

        $citas = $query->orderBy('fecha')->orderBy('hora')->get();

        return response()->json($citas);
    }

    public function store(StoreCitaRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        // Solo un admin puede agendar a nombre de otro cliente
        $data['user_id'] = ($user->isAdmin() && isset($data['user_id']))
            ? $data['user_id']
            : $user->id;

        $data['estado'] = $data['estado'] ?? 'pendiente';

        $cita = Cita::create($data);

        return response()->json([
            'message' => 'Cita agendada correctamente.',
            'cita' => $cita->load(['cliente', 'servicio']),
        ], 201);
    }

    public function show(Request $request, Cita $cita)
    {
        $this->autorizarAcceso($request, $cita);

        return response()->json($cita->load(['cliente', 'servicio']));
    }

    public function update(StoreCitaRequest $request, Cita $cita)
    {
        $this->autorizarAcceso($request, $cita);

        $data = $request->validated();
        unset($data['user_id']); // no se reasigna el dueño de la cita al editar

        $cita->update($data);

        return response()->json([
            'message' => 'Cita actualizada correctamente.',
            'cita' => $cita->load(['cliente', 'servicio']),
        ]);
    }

    // Cancelar cita (no se borra físicamente, se marca como cancelada)
    public function destroy(Request $request, Cita $cita)
    {
        $this->autorizarAcceso($request, $cita);

        $cita->update(['estado' => 'cancelada']);

        return response()->json([
            'message' => 'Cita cancelada correctamente.',
            'cita' => $cita,
        ]);
    }

    private function autorizarAcceso(Request $request, Cita $cita): void
    {
        $user = $request->user();

        abort_if(
            ! $user->isAdmin() && $cita->user_id !== $user->id,
            403,
            'No tienes permiso para modificar esta cita.'
        );
    }
}
