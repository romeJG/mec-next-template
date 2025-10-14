<?php

namespace App\Http\Controllers;

use App\Helpers\LocalFileHelper;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    /**
     * get the user's Banner
     */
    public function getProfileAndBanner(): JsonResponse
    {
        try {
            $user = User::where("email", User::getTokenClaim("email"))->first();
            return response()->json([
                'status' => "success",
                'profile_banner' => $user->profile_banner,
                'profile' => LocalFileHelper::getFile('profile_picture', $user->profile_picture)->file
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Change the User's banner
     * @param $request-> selectedBanner
     * @return JsonResponse 
     */
    public function updateProfileBanner(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'selectedBanner' => 'required|string'
            ], [
                'selectedBanner.required' => 'Banner is Required',
                'selectedBanner.string' => 'Invalid Banner',
            ]);

            //update the user's banner
            User::where("id", User::getTokenClaim("id"))
                ->update(['profile_banner' => $request->selectedBanner]);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile Banner Updated!',
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
     * Change the profile picture of the user
     * @param $request->profileImage
     * @return JsonResponse
     */
    public function updateProfilePicture(Request $request)
    {
        try {
            $request->validate([
                'profilePhoto' => 'required|file|mimes:jpg,jpeg,png,webp',
            ], [
                'profilePhoto.required' => 'An image was not provided.',
                'profilePhoto.file' => 'Profile Photo is not a file',
                'profilePhoto.mimes' => 'Invalid image format'
            ]);
            $userEmail = User::getTokenClaim("email");
            if (!$userEmail) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid or missing token.'
                ], 401);
            }
            $storedImage = LocalFileHelper::storeAndCompressImage("profile_picture", $request->profilePhoto);

            $user = User::where("email", $userEmail)->first();
            if ($user->profile && $storedImage->status) {
                LocalFileHelper::deleteFile("profile_picture", $user->profile);
            }
            $user->profile_picture = $storedImage->file;
            $user->save();
            return response()->json([
                'status' => 'success',
                'message' => 'Profile Picture Updated Successfuly',
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
     * Gets the profile Picture BLOB
     * @param Request $request
     * @return JsonResponse
     */
    public function getProfilePictureBLOB(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'fileName' => 'required|string'
            ], [
                'fileName.required' => 'File name is required',
                'fileName.string' => 'File name is invalid'
            ]);
            $fileHelper = LocalFileHelper::getFile('profile_picture', $request->fileName);
            if ($fileHelper->status) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Success!',
                    'profilePictureBLOB' => $fileHelper->file
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'File not found!',
                ], 404);
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
}
