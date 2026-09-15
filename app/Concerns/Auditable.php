<?php

namespace App\Concerns;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

/**
 * Provides a convenient audit() method for logging business actions.
 * Use this in Service classes to record important user actions.
 */
trait Auditable
{
    protected function audit(
        string $action,
        ?object $model = null,
        array $oldValues = [],
        array $newValues = []
    ): void {
        AuditLog::create([
            'shop_id'        => Auth::user()?->shop_id,
            'user_id'        => Auth::id(),
            'action'         => $action,
            'auditable_type' => $model ? get_class($model) : null,
            'auditable_id'   => $model?->id,
            'old_values'     => ! empty($oldValues) ? $oldValues : null,
            'new_values'     => ! empty($newValues) ? $newValues : null,
            'ip_address'     => Request::ip(),
            'user_agent'     => Request::userAgent(),
        ]);
    }
}
