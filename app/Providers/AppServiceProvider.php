<?php

namespace App\Providers;

use App\Http\Middleware\EnsureShopIsActive;
use App\Http\Middleware\SuperAdminMiddleware;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureGates();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(8)
                ->mixedCase()
                ->letters()
                ->numbers()
            : null,
        );
    }

    /**
     * Configure global Gates for super admin bypass.
     */
    protected function configureGates(): void
    {
        // Super Admin can bypass all policy checks
        Gate::before(function ($user, $ability) {
            if ($user->is_super_admin) {
                return true;
            }
        });
    }
}
