<?php

namespace App\Http\Controllers;

use App\Models\Dropdown;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Illuminate\Validation\ValidationException;

class DropdownController extends Controller
{

    /**
     * Get All Dropdown Types
     * @return JsonResponse
     */
    public function getAllDropdownTypes(): JsonResponse
    {
        try {
            $dropdowns = Dropdown::pluck('type')->unique()->sort()->values();
            return response()->json([
                'message' => 'Success! dropdowns',
                'dropdowns' => $dropdowns
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
     * Gets all the venues in the dropdown table
     * @return JsonResponse
     */
    public function getVenues(): JsonResponse
    {
        try {
            $venues = Dropdown::where('type', 'venues')->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Success!',
                'venues' => $venues
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
     * Create Dropdown Venue
     * @param Request $request
     * @return JsonResponse
     */
    public function storeVenue(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'value' => 'required|string|max:255|unique:venues,name',
            ], [
                'value.required' => 'The venue field is required.',
                'value.string' => 'The venue field must be a string.',
                'value.max' => 'The venue field must not exceed 255 characters.',
            ]);
            Dropdown::create([
                'type' => 'venues',
                'value' => $request->value
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Success! stored venue:' . $request->venue,
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
     * Update Vnue
     * @param Request $request
     * @return JsonResponse
     */
    public function updateVenue(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'id' => 'required|integer|exists:dropdowns,id',
                'value' => 'required|string|max:255',
            ], [
                'id.required' => 'The id field is required.',
                'id.integer' => 'The id field must be an integer.',
                'value.required' => 'The venue field is required.',
                'value.string' => 'The venue field must be a string.',
                'value.max' => 'The venue field must not exceed 255 characters.',
            ]);
            Dropdown::where('id', $request->id)->update([
                'value' => $request->value
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Success!',
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
     * Get a specific dropdown type
     * @param Request $request
     * @return JsonResponse
     */
    public function getDropdownType(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'dropdownType' => 'required|string',
            ], [
                'dropdownType.required' => 'The dropdownType field is required.',
                'dropdownType.string' => 'The dropdownType field must be a string.',
            ]);
            $dropdowns = Dropdown::where('type', $request->dropdownType)->get();
            return response()->json([
                'status' => 'success',
                'message' => 'Success!',
                'dropdowns' => $dropdowns
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
     * Get a specific dropdown type
     * @param Request $request
     * @return JsonResponse
     */
    public function getDropdownTypeValues(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'dropdownType' => 'required|string',
            ], [
                'dropdownType.required' => 'The dropdownType field is required.',
                'dropdownType.string' => 'The dropdownType field must be a string.',
            ]);
            $dropdowns = Dropdown::where('type', $request->dropdownType)->get()->pluck('value');
            return response()->json([
                'status' => 'success',
                'message' => 'Success!',
                'dropdowns' => $dropdowns
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
     * Updates a specific ID of a dropdown
     * @param Request $request
     * @return JsonResponse
     */
    public function updateDropdownItem(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'id' => 'required|exists:dropdowns,id|int',
                'value' => 'required|string'
            ], [
                'id.required' => 'The id field is required.',
                'id.integer' => 'The id field must be an integer.',
                'id.exists' => 'The id field must be an existing dropdown item.',
            ]);
            Dropdown::where('id', $request->id)->update([
                'value' => $request->value
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Success!',
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
     * store a dropdown item
     * @param Request $request
     * @return JsonResponse
     */
    public function storeDropdownItem(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'type' => 'required|string',
                'value' => 'required|string'
            ], [
                'type.required' => 'The type field is required.',
                'type.string' => 'The type field must be a string.',
                'value.required' => 'The value field is required.',
                'value.string' => 'The value field must be a string.',
            ]);
            Dropdown::create([
                'type' => $request->type,
                'value' => $request->value
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Success!',
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
     * delete dropdown item
     * @param Request $request
     * @return JsonResponse
     */
    public function deleteDropdownItem(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'id' => 'required|exists:dropdowns,id|int',
            ], [
                'id.required' => 'The id field is required.',
                'id.integer' => 'The id field must be an integer.',
                'id.exists' => 'The id field must be an existing dropdown item.',
            ]);
            Dropdown::where('id', $request->id)->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Success!',
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
