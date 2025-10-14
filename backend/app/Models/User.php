<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Tymon\JWTAuth\Facades\JWTAuth;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [
        'id',
        'created_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
    ];
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'password' => 'hashed',
        'permissions' => 'array',
        'route_access' => 'array',
        'status' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'department' => $this->department,
            'position' => $this->position,
            'profile' => $this->profile,
            'profile_banner' => $this->profile_banner,
            'permissions' => $this->permissions,
            'route_access' => $this->route_access,
            'account_disabled' => $this->account_disabled,
            'status' => $this->status,
        ];
    }

    public static function getTokenDetails(): ?object
    {
        try {
            return JWTAuth::parseToken()->getPayload();
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function getTokenClaim(string $toGet): mixed
    {
        $payload = self::getTokenDetails();
        return $payload ? $payload->get($toGet) : null;
    }
}
