import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService, Permission } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
        return router.createUrlTree(['/login']);
    }

    const user = auth.currentUser();
    if (user?.role === 'admin') {
        return true;
    }

    const requiredPermission = route.data?.['permission'] as Permission;
    if (!requiredPermission) {
        // If no specific permission is required, let them through
        return true;
    }

    const hasPermission = user?.permissions?.includes(requiredPermission);
    if (hasPermission) {
        return true;
    }

    // Redirect to dashboard if they lack permission
    return router.createUrlTree(['/home/dashboard']);
};
