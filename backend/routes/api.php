<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DropdownController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are loaded by the RouteServiceProvider and assigned to the "api" middleware group.
| Make something great!
|--------------------------------------------------------------------------
*/

//Public Auth Routes


// Throttle request 60 request per hour
Route::middleware(['throttle:60,3600'])->group(function () {
    Route::post('check-email', [AuthController::class, 'checkEmailIsAdmin']);
    Route::post('send-login-otp', [AuthController::class, 'emailLoginOTP']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('login-admin', [AuthController::class, 'loginAdmin']);
    Route::post('check-password', [AuthController::class, 'checkAdminPassword']);
});

//Protected Routes (JWT-authenticated users)
Route::middleware(['auth:api'])->group(function () {

    //Routes accessible by any authenticated role (wildcard permission)
    Route::middleware(['permission:*'])->group(function () {
        //* Auth
        Route::prefix('auth')->group(function () {
            Route::get('/validate-token', [AuthController::class, 'validateJWT']);
            Route::post('/logout', [UserController::class, 'logout']);
        });

        //* Profile
        Route::prefix('profile')->group(function () {
            Route::get('/', [ProfileController::class, 'getProfileAndBanner']);
            Route::get('/profile-picture-blob', [ProfileController::class, 'getProfilePictureBLOB']);

            Route::post('picture', [ProfileController::class, 'updateProfilePicture']);

            Route::patch('banner', [ProfileController::class, 'updateProfileBanner']);
        });
    });

    //* Admin
    Route::middleware(['permission:admin'])->group(function () {

        Route::prefix('users')->group(function () {

            Route::get('/', [UserController::class, 'index']);
            Route::get('/grouped-by-department', [UserController::class, 'groupedByDepartment']);

            Route::post('/', [UserController::class, 'store']);

            Route::patch('/', [UserController::class, 'update']);
            Route::patch('/terminate', [UserController::class, 'terminateUser']);
            Route::patch('/activate', [UserController::class, 'activateUser']);
        });

        Route::prefix('profile')->group(function () {
            Route::patch('/change-admin-password', [UserController::class, 'changeAdminPassword']);
        });

        Route::prefix('dropdowns')->group(function () {
            //Immutables since its from the user's data
            Route::get('/departments', [UserController::class, 'getExistingDepartments']);
            Route::get('/positions', [UserController::class, 'getExistingPositions']);

            // Dropdown get dropdown types
            Route::get('/', [DropdownController::class, 'getAllDropdownTypes']);
            Route::get('/type', [DropdownController::class, 'getDropdownType']);
            Route::get('/values', [DropdownController::class, 'getDropdownTypeValues']);
            Route::post('/item', [DropdownController::class, 'storeDropdownItem']);
            Route::patch('/item', [DropdownController::class, 'updateDropdownItem']);
            Route::delete('/item', [DropdownController::class, 'deleteDropdownItem']);
        });

        Route::prefix('access')->group(function () {
            Route::get('/', [UserController::class, 'index']);
        });

        Route::prefix('roles')->group(function () {
            Route::get('/', [RoleController::class, 'index']);
        });
    });
});
