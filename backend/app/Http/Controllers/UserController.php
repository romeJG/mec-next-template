<?php

namespace App\Http\Controllers;

use App\Helpers\LocalFileHelper;
use App\Helpers\PermissionHelper;
use App\Mail\SendMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{

    /**
     * Handles Getting users with or without params
     * @param Request $request->status
     * @param Request $request->role
     * @return JsonResponse
     * 
     */

    public function index(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'role' => 'required|string',
                'status' => 'required|string'
            ], [
                'role.string' => 'Role should be a string.',
                'status.string' => 'Status should be a string.',
            ]);

            $query = User::query();

            if ($request->role !== 'all') {
                $query->whereJsonContains('permissions', $request->role);
            }

            $users = $query->orderBy('last_name')->get();

            $transformedUsers = $users->map(function ($user) {
                $signedUrl = null;

                if ($user->profile_picture) {
                    $response = LocalFileHelper::getTemporarySignedUrl('profile_picture', $user->profile_picture, 5);

                    if ($response->status) {
                        $signedUrl = $response->file;
                    }
                }

                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'middle_name' => $user->middle_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'department' => $user->department,
                    'position' => $user->position,
                    'job_level' => $user->job_level,
                    'permissions' => $user->permissions,
                    'route_access' => $user->route_access,
                    'status' => $user->status,
                    'profile_banner' => $user->profile_banner,
                    'profilePictureUrl' => $signedUrl,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ];
            });

            return response()->json([
                'status' => 'success',
                'message' => "Successfully fetched users for role: {$request->role} and status: {$request->status}",
                'users' => $transformedUsers,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handles storing the user to the database
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'firstName' => 'required|string|min:2|max:50|regex:/^[A-Za-z\s\-]+$/',
                'lastName' => 'required|string|min:2|max:50|regex:/^[A-Za-z\s\-]+$/',
                'middleName' => 'nullable|string|min:1|max:50|regex:/^[A-Za-z\s\-]+$/',
                'email' => 'required|email|unique:users,email|max:255',
                'position' => 'required|string|min:2|max:100',
                'department' => 'required|string|min:2|max:100',
                'jobLevel' => 'required|string',
                'pageAccess' => 'required',
            ], [
                // Email
                'email.required' => 'Email is required.',
                'email.email' => 'Invalid email format.',
                'email.unique' => 'Email already exists.',
                'email.max' => 'Email too long.',
                // General fields
                '*.required' => ':attribute is required.',
                '*.string' => ':attribute must be text.',
                '*.min' => ':attribute too short.',
                '*.max' => ':attribute too long.',
                '*.regex' => 'Invalid :attribute format.',
            ]);
            $permissions = PermissionHelper::routeAccesToPermissionsArray($request->pageAccess);
            if (in_array("admin", $permissions)) {
                //process for admins
                //a temp password will be given to them
                $password = OtpController::generateOTP(8);
                User::create([
                    'email' => strtolower($request->email),
                    'first_name' => strtoupper($request->firstName),
                    'middle_name' => strtoupper($request->middleName),
                    'last_name' => strtoupper($request->lastName),
                    'password' => Hash::make($password),
                    'department' => $request->department,
                    'position' => $request->position,
                    'job_level' => $request->jobLevel,
                    'permissions' => $permissions,
                    'route_access' => $request->pageAccess
                ]);

                $data = [
                    'rawTempPass' => $password,
                ];
                $template = 'admin_temp_pass';
                $subject = 'MEC Template | Your account has been created';
                Mail::to($request->email)->send(new SendMail($subject, $data, $template));
            } else {
                //process for normal users
                User::create([
                    'email' => strtolower($request->email),
                    'first_name' => strtoupper($request->firstName),
                    'middle_name' => strtoupper($request->middleName),
                    'last_name' => strtoupper($request->lastName),
                    'department' => $request->department,
                    'position' => $request->position,
                    'permissions' => $permissions,
                    'route_access' => $request->pageAccess
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully Created An account for: ' . $request->email,
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
    /**
     * Update the user's data
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'id' => 'required|int',
                'firstName' => 'required|string|min:2|max:50|regex:/^[A-Za-z\s\-]+$/',
                'lastName' => 'required|string|min:2|max:50|regex:/^[A-Za-z\s\-]+$/',
                'middleName' => 'nullable|string|min:1|max:50|regex:/^[A-Za-z\s\-]+$/',
                'email' => 'required|email|max:255',
                'position' => 'required|string|min:2|max:100',
                'department' => 'required|string|min:2|max:100',
                'jobLevel' => 'required|int',
                'pageAccess' => 'required'
            ], [
                // Email
                'email.required' => 'Email is required.',
                'email.email' => 'Invalid email format.',
                'email.max' => 'Email too long.',
                // General fields
                '*.required' => ':attribute is required.',
                '*.string' => ':attribute must be text.',
                '*.min' => ':attribute too short.',
                '*.max' => ':attribute too long.',
                '*.regex' => 'Invalid :attribute format.',
                '*.int' => ':attribute should be a number',
            ]);
            $permissions = PermissionHelper::routeAccesToPermissionsArray($request->pageAccess);
            $user = User::where('id', $request->id)->first();
            $user->update([
                'email' => strtolower($request->email),
                'first_name' => strtoupper($request->firstName),
                'middle_name' => strtoupper($request->middleName),
                'last_name' => strtoupper($request->lastName),
                'department' => $request->department,
                'position' => $request->position,
                'job_level' => $request->jobLevel,
                'permissions' => $permissions,
                'route_access' => $request->pageAccess
            ]);
            $user->save();
            return response()->json([
                'status' => 'success',
                'message' => 'Successfully Updated An account for: ' . $request->email,
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
    /**
     * Handle user logout.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(): JsonResponse
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json([
                'status' => 'success',
                'message' => 'Successfully logged out'
            ], 200);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to logout, token invalid or missing'
            ], 500);
        }
    }
    /**
     * Handle Getting departments
     * @return JsonResponse
     */
    public function getExistingDepartments(): JsonResponse
    {
        try {
            $departments = User::pluck('department')->unique()->sort()->values();
            return response()->json([
                'status' => 'success',
                'departments' => $departments,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Handle Getting positions and departments
     * @return JsonResponse
     */
    public function getExistingPositions(): JsonResponse
    {
        try {
            $positions = User::pluck('position')->unique()->sort()->values();
            return response()->json([
                'status' => 'success',
                'positions' => $positions
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Function to terminate a user
     * @param Request $request
     * @return JsonResponse
     */
    public function terminateUser(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'id' => "required|int|exists:users,id"
            ], [
                'id.required' => "There was no user ID provided",
                'id.int' => 'The id is not the correct format',
                'id.exists' => 'User does not exist in the database'
            ]);
            $user = User::where(['id' => $request->id])->first();
            //if the user's role includes super-admin you cant terminate it

            if (in_array('super admin', $user->permissions ?? [])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You cannot terminate a super admin account'
                ], 403);
            }

            $user->status = "terminated";
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Account terminated',
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
    /**
     * function Activate a user
     * @param Request $request
     * @return JsonResponse
     */
    public function activateUser(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'id' => "required|int|exists:users,id"
            ], [
                'id.required' => "There was no user ID provided",
                'id.int' => 'The id is not the correct format',
                'id.exists' => 'User does not exist in the database'
            ]);

            User::where('id', $request->id)->update(['status' => 'active']);


            return response()->json([
                'status' => 'success',
                'message' => 'Success! user activated',
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
    /**
     * Goroup by department
     * @param Request $request
     * @return JsonResponse
     */
    public function groupedByDepartment(): JsonResponse
    {
        try {
            // only first_name, last_name, email, position, job_level, status, profile_picture 
            $users = User::select('id', 'first_name', 'last_name', 'email', 'position', 'department', 'job_level', 'status', 'profile_picture')
                ->orderBy('department')
                ->get()
                ->groupBy('department')
                ->sortKeys();


            return response()->json([
                'status' => 'success',
                'message' => 'Success!',
                'groupedUsers' => $users
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
