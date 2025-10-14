<?php

namespace App\Http\Responses;

class FileResponse
{
    public bool $status;
    public ?string $file;
    public ?string $error;

    public function __construct(bool $status, ?string $file = null, ?string $error = null)
    {
        $this->status = $status;
        $this->file = $file;
        $this->error = $error;
    }
}
