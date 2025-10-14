<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckPermission
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $permissions): Response
    {
        try {
            if (!JWTAuth::getToken()) {
                return response()->json(['error' => 'Token not provided'], 401);
            }

            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json(['error' => 'User not found'], 401);
            }

            // Ensure permissions are always an array
            $userPermissions = is_array($user->permissions)
                ? $user->permissions
                : json_decode($user->permissions, true) ?? [];

            // Split & trim the required permissions
            $requiredPermissions = array_map('trim', preg_split('/[|,]/', $permissions));

            // Skip permission check if wildcard present
            if (in_array('*', $requiredPermissions)) {
                return $next($request);
            }

            // Check intersection
            if (empty(array_intersect($requiredPermissions, $userPermissions))) {
                return response()->json(['error' => 'Permission denied'], 403);
            }

            return $next($request);
        } catch (TokenExpiredException $e) {
            return response()->json(['error' => 'Token expired'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token error', 'message' => $e->getMessage()], 401);
        }
    }
}
