<?php

namespace App\Helpers;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use App\Http\Responses\FileResponse;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class LocalFileHelper
{
    /**
     * Stores a file in private storage.
     *
     * @param string $dir
     * @param object $file
     * @return FileResponse
     */
    public static function storeFile(string $dir, UploadedFile $file): FileResponse
    {
        try {
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $baseName = pathinfo($originalName, PATHINFO_FILENAME);

            $randomString = Str::random(8);
            $storedImageName = User::getTokenClaim("email") . "_{$baseName}_{$randomString}.{$extension}";

            $file->storeAs($dir, $storedImageName, 'local');

            return new FileResponse(true, $storedImageName);
        } catch (\Exception $e) {
            Log::error('File store failed: ' . $e->getMessage());
            return new FileResponse(false, null, $e->getMessage());
        }
    }

    /**
     * Stores and compress ano image
     * 
     * @param string $dir
     * @param object $file
     * @return FileResponse 
     */
    public static function storeAndCompressImage(string $dir, UploadedFile $file): FileResponse
    {
        try {
            $manager = new ImageManager(new Driver());

            $image = $manager->read($file);
            $image->scale(width: 500);

            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $baseName = pathinfo($originalName, PATHINFO_FILENAME);
            $randomString = Str::random(8);

            $email = User::getTokenClaim("email") ?? 'anonymous';

            $imageName = "{$email}_{$baseName}_{$randomString}.{$extension}";

            $storagePath = storage_path("app/private/{$dir}");
            if (!is_dir($storagePath)) {
                mkdir($storagePath, 0755, true);
            }

            $image->save("{$storagePath}/{$imageName}");

            return new FileResponse(true, $imageName);
        } catch (\Exception $e) {
            Log::error('File store failed: ' . $e->getMessage());
            return new FileResponse(false, null, $e->getMessage());
        }
    }

    /**
     * Deletes file(s) from private storage.
     *
     * @param string $dir
     * @param string|array $fileName
     * @return bool
     */
    public static function deleteFile(string $dir, string|array $fileName): bool
    {
        try {
            $disk = Storage::disk('local');

            if (is_array($fileName)) {
                foreach ($fileName as $file) {
                    if ($file && $disk->exists("{$dir}/{$file}")) {
                        $disk->delete("{$dir}/{$file}");
                    }
                }
            } else {
                if ($fileName && $disk->exists("{$dir}/{$fileName}")) {
                    $disk->delete("{$dir}/{$fileName}");
                }
            }
            return true;
        } catch (\Exception $e) {
            Log::error('File delete failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Gets the file from private storage and returns base64 encoded file.
     *
     * @param string $dir
     * @param string $fileName
     * @return FileResponse
     */
    public static function getFile(string $dir, string $fileName): FileResponse
    {
        try {
            $disk = Storage::disk('local');

            if ($fileName && $disk->exists("{$dir}/{$fileName}")) {
                $fileContents = $disk->get("{$dir}/{$fileName}");
                $mimeType = $disk->mimeType("{$dir}/{$fileName}");
                $base64EncodedFile = "data:{$mimeType};base64," . base64_encode($fileContents);

                return new FileResponse(true, $base64EncodedFile);
            } else {
                return new FileResponse(false, null, 'File not found.');
            }
        } catch (\Exception $e) {
            Log::error('File retrieval failed: ' . $e->getMessage());
            return new FileResponse(false, null, $e->getMessage());
        }
    }
    /**
     * Generates a temporary signed URL for a private file.
     *
     * @param string $dir
     * @param string $fileName
     * @param int $expirationMinutes
     * @return FileResponse
     */
    public static function getTemporarySignedUrl(string $dir, string $fileName, int $expirationMinutes = 10): FileResponse
    {
        try {
            $path = "{$dir}/{$fileName}";

            if (!Storage::disk('local')->exists($path)) {
                return new FileResponse(false, null, 'File does not exist.');
            }

            $url = Storage::disk('local')->temporaryUrl(
                $path,
                now()->addMinutes($expirationMinutes)
            );

            return new FileResponse(true, $url);
        } catch (\Exception $e) {
            Log::error("Generating signed URL failed: " . $e->getMessage());
            return new FileResponse(false, null, $e->getMessage());
        }
    }
}
