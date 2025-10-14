<?php

namespace App\Http\Controllers;

use App\Mail\SendMail;
use App\Models\Otp;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class OtpController extends Controller
{
    /**
     * Generate a random OTP of specified length.
     *
     * @param int $requestedCharLength The length of the OTP to be generated. default is 6.
     * @return string The generated OTP.
     */
    public static function generateOTP(int $requestedCharLength = 6): string
    {
        $characterPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $characterPoolLength = strlen($characterPool);
        $otp = '';
        for ($i = 0; $i < $requestedCharLength; $i++) {
            $otp .= $characterPool[rand(0, $characterPoolLength - 1)];
        }
        return $otp;
    }

    /**
     * Hash the OTP using Laravel's Hash facade.
     *
     * @param string $otp The OTP to be hashed.
     * @return string The hashed OTP.
     */
    public static function hashOTP(string $otp): string
    {
        return Hash::make($otp);
    }

    /**
     * Verify the provided OTP against the stored hashed OTP.
     *
     * @param string $a input from the user.
     * @param string $b stored hash in the database.
     * @return bool True if the OTP is valid, false otherwise.
     */
    function compareHash(string $a, string $b)
    {
        if (empty($a) || empty($b)) {
            return false; // If either value is empty, return false
        }
        // Compare the two hash values using Laravel's Hash facade 
        return Hash::check($a, $b);
    }

    /**
     * Verify the OTP for a given email and OTP type.
     * 
     * @param string $email The email address associated with the OTP.
     * @param string $otp The OTP to verify.
     * @param string $OTPtype The type of OTP (e.g., 'login', 'registration').
     * @return bool True if the OTP is valid, false otherwise.
     */
    public static function verifyOTP(string $email, string $otp, string $OTPtype)
    {
        $otpRecord = OTP::where([
            ['email', $email],
            ['expires_at', '>', Carbon::now()],
            ['type', $OTPtype]
        ])->first();

        if (Hash::check($otp, $otpRecord->otp)) {
            $otpRecord->delete();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Handle the request to send an OTP to the user's email for login.
     *
     * @param string $type The type of OTP request (e.g., 'login').
     * @param string $email The email address to which the OTP will be sent.
     * @return JsonResponse A JSON response indicating the success or failure of the operation.
     */
    public static function emailOTP(string $otpType, string $email): JsonResponse
    {
        try {
            $authController = new AuthController();
            if (!$authController->checkEmailExist($email)) {
                return response()->json(
                    [
                        'status' => 'error',
                        'message' => 'Email does not exist in our records.',
                    ],
                    404
                );
            }
            // Generate a random OTP
            $otp = self::generateOTP();
            $hashedOtp = self::hashOTP($otp);

            $data = [
                'otp' => $otp,
            ];
            $template = 'otp';
            $subject = 'MEC Template | here is your OTP';
            Mail::to($email)->send(new SendMail($subject, $data, $template));

            Otp::updateOrCreate(
                ['email' => $email],
                [
                    'otp' => $hashedOtp,
                    'expires_at' => now()->addMinutes(5),
                    'type' => $otpType,
                ]
            );

            //return success response to the function it has been called from
            return response()->json(
                [
                    'status' => 'success',
                    'message' => 'OTP sent successfully to ' . $email,
                ],
                200
            );
        } catch (\Exception $e) {
            // Return an error response
            return response()->json(
                [
                    'status' => 'error',
                    'message' => 'Failed to send OTP. Please try again later.',
                ],
                500
            );
        }
    }
}
