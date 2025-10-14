<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAccess extends Model
{
    //
    protected $table = 'user_access';
    protected $guarded = [
        'id',
        'role',
        'role_access'
    ];

    protected $cast = [
        'role_access' => 'array'
    ];
}
