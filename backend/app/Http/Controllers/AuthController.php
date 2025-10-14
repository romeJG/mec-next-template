<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{

    /**
     * Function to check if the email exists in the database.
     * 
     * @param Request $request
     * @return bolean
     */
    public function checkEmailExist(string $email): bool
    {
        return User::where('email', $email)->exists();
    }

    /**
     * Function to send emails with OTP for login.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse    
     */
    public function emailLoginOTP(Request $request): JsonResponse
    {
        try {
            $request->validate(
                [
                    'email' => 'required|email|exists:users,email',
                ],
                [
                    'email.required' => 'Email is required.',
                    'email.email' => 'Invalid email format.',
                    'email.exists' => 'Email does not exist in our records.'
                ]
            );
            //email the OTP this controller function returns the response from the OtpController
            return OtpController::emailOTP("login", $request->email);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'status' => 'error',
                    'message' => 'Failed to send OTP: ' . $e->getMessage()
                ],
                500
            );
        }
    }
    /**
     * Function to check if the email belongs to an admin user.
     * It checks if the user has 'employee' permission but not 'admin'.
     * Returns a JSON response indicating whether the user is an admin or not.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse    
     */
    public function checkEmailIsAdmin(Request $request): JsonResponse
    {
        try {
            $request->validate(
                [
                    'email' => 'required|email|exists:users,email',
                ],
                [
                    'email.required' => 'Email is required.',
                    'email.email' => 'Invalid email format.',
                    'email.exists' => 'Email does not exist in our records.'
                ]
            );


            $user = User::where('email', $request->email)->first();
            if (in_array($user->status, ["terminated", "unverified"])) {
                return response()->json(
                    [
                        'status' => 'error',
                        'message' => 'Your account is inactive please contact the administrator'

                    ],
                    403
                );
            }
            if (
                in_array('employee', $user->permissions) &&
                !in_array('admin', $user->permissions)
            ) {
                return response()->json(
                    [
                        'status' => 'success',
                        'isAdmin' => false,
                    ],
                    203
                );
            } else {
                return response()->json(
                    [
                        'status' => 'success',
                        'isAdmin' => true,
                    ],
                    200
                );
            }
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'status' => 'error',
                    'message' => $e->getMessage()
                ],
                500
            );
        }
    }

    /**
     * Function to handle user login using OTP.
     * It validates the request, verifies the OTP, and generates a JWT token for the normal user
     * @param Request $request->email
     * @param Request $request->otp
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email',
                'otp' => 'required|string',
            ], [
                'email.required' => 'Email is required.',
                'email.email' => 'Invalid email format.',
                'email.exists' => 'Email does not exist in our records.',
                'otp.required' => 'OTP is required.',
                'otp.string' => 'OTP must be a string.'
            ]);

            $isOTPVerified = OtpController::verifyOtp($request->email, $request->otp, "login");
            $user = User::where('email', $request->email)->first();
            $tokenWithCustomClaims = JWTAuth::fromUser($user);

            //Admins should be going throgh the adminLogin()
            if (in_array("admin", $user->permissions)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized access.'
                ], 403);
            }

            if ($isOTPVerified && $tokenWithCustomClaims) {
                return response()->json([
                    'status' => 'success',
                    'token' => $tokenWithCustomClaims,
                    'message' => 'Login successful.'
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid OTP or OTP expired.'
                ], 406);
            }
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
     * function that handles admin login,
     * it validates the otp, password, user permissions, and generates a JWT token for the admin user
     * @param Request $request->email
     * @param Request $request->otp
     * @param Request $request->password
     * @return \Illuminate\Http\JsonResponse
     */
    public function loginAdmin(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email',
                'otp' => 'required|string',
                'password' => 'required|string|min:8|max:255',
            ], [
                'email.required' => 'Email is required.',
                'email.email' => 'Invalid email format.',
                'email.exists' => 'Email does not exist in our records.',
                'otp.required' => 'OTP is required.',
                'otp.string' => 'OTP must be a string.',
                'password.required' => 'Password is required.',
                'password.string' => 'Password must be a string.'
            ]);

            $isOTPVerified = OtpController::verifyOtp($request->email, $request->otp, "login");
            $user = User::where('email', $request->email)->first();

            if ($user === null || !in_array('admin', $user->permissions)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized access.'
                ], 403);
            }

            if (password_verify($request->password, $user->password) && $isOTPVerified) {
                $token = JWTAuth::fromUser($user);
                return response()->json([
                    'status' => 'success',
                    'token' => $token,
                    'message' => 'Login successful.'
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid OTP or password.'
                ], 401);
            }
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
     * Function to handle admin login using OTP.
     * It validates the request, verifies the OTP, and generates a JWT token for the admin user
     * @param Request $request->email
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkAdminPassword(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email',
                'password' => 'required|string|min:8|max:255',
            ], [
                'email.required' => 'Email is required.',
                'email.email' => 'Invalid email format.',
                'email.exists' => 'Email does not exist in our records.',
                'password.required' => 'Password is required.',
                'password.string' => 'Password must be a string.'
            ]);

            $user = User::where('email', $request->email)->first();

            if ($user === null || !in_array('admin', $user->permissions)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized access.'
                ], 403);
            }

            if (password_verify($request->password, $user->password)) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Password is correct.'
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Incorrect password.'
                ], 401);
            }
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
     * Validates the JWT token returns a JSON response indicating whether the token is valid or not.
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateJWT(): JsonResponse
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid JWT.'
                ], 401);
            }

            $payload = JWTAuth::parseToken()->getPayload();
            $userPermissions = $payload->get('permissions', []);
            $userRouteAccess = $payload->get('route_access', []);

            // Double-check token claims match DB (extra safety layer)
            if ($user->permissions !== $userPermissions || $user->route_access !== $userRouteAccess) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'JWT permissions or route access mismatch.'
                ], 403);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'JWT is valid.'
            ], 200);
        } catch (JWTException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token is invalid or expired.'
            ], 401);
        }
    }
}
