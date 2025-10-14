<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    protected $table = 'otps';

    protected $fillable = [
        'email',
        'otp',
        'type',
        'expires_at',
    ];

    public $timestamps = true;

    protected $casts = [
        'expires_at' => 'datetime',
    ];
}
