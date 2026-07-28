<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCitaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // El admin puede agendar a nombre de cualquier cliente; un cliente normal solo agenda para sí mismo
            'user_id' => ['sometimes', 'exists:users,id'],
            'servicio_id' => ['required', 'exists:servicios,id'],
            'fecha' => ['required', 'date', 'after_or_equal:today'],
            'hora' => ['required', 'date_format:H:i'],
            'estado' => ['sometimes', Rule::in(['pendiente', 'confirmada', 'cancelada', 'completada'])],
            'notas' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'servicio_id.required' => 'Debes seleccionar un servicio.',
            'servicio_id.exists' => 'El servicio seleccionado no existe.',
            'fecha.required' => 'La fecha es obligatoria.',
            'fecha.after_or_equal' => 'No puedes agendar una fecha pasada.',
            'hora.required' => 'La hora es obligatoria.',
            'hora.date_format' => 'La hora debe tener formato HH:MM.',
        ];
    }
}
