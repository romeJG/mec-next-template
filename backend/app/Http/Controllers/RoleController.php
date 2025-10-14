<?php

namespace App\Http\Controllers;

use App\Models\UserAccess;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;



class RoleController extends Controller
{
    /**
     * gets all the userAccess
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $roles = ['Admin'];

            // maps the roles into a unified json
            $userAccess = collect($roles)->mapWithKeys(function ($role) {
                $rawAccess = UserAccess::where('role', $role)->pluck('role_access')->first();
                $decodedAccess = json_decode($rawAccess, true); // <- decode JSON string to PHP array
                return [$role => $decodedAccess];
            });


            return response()->json([
                'status' => 'success',
                'message' => 'Success!',
                'userAccess' => $userAccess
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
