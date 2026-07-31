<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'servicio_id',
        'fecha',
        'hora',
        'estado',
        'notas',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
        ];
    }

    public function cliente()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function servicio()
    {
        return $this->belongsTo(Servicio::class);
    }
}
