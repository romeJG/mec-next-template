<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dropdown extends Model
{
    public $timestamps = false;
    public $table = 'dropdowns';
    public $fillable = ['value', 'type', 'status'];
}
