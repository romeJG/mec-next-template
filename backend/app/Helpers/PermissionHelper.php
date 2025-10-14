<?php


namespace App\Helpers;

class PermissionHelper
{

    public static function routeAccesToPermissionsArray(array $route_access)
    {
        return array_map('strtolower', array_keys($route_access));
    }
}
