import { Injectable, signal } from '@angular/core';

export type UserRole = 'superAdmin' | 'admin' | 'user';

// ── Catálogo de permisos ──────────────────────────────────────────────────────
export const ALL_PERMISSIONS = [
    // Grupos
    'group:create', 'group:edit', 'group:delete', 'group:view', 'group:add', 'group:add_member', 'group:remove_member',
    // Tickets
    'ticket:create', 'ticket:edit', 'ticket:delete', 'ticket:view', 'ticket:add',
    'ticket:assign', 'ticket:change_status', 'ticket:edit_state', 'ticket:comment',
    // Usuarios
    'user:create', 'user:edit', 'user:add', 'user:delete', 'user:view', 'users:view', 'user:manage_permissions',
] as const;

export type Permission = typeof ALL_PERMISSIONS[number];

// ── Permisos predefinidos ─────────────────────────────────────────────────────
const ADMIN_PERMS: Permission[] = [
    'group:view', 'group:edit', 'group:add', 'group:delete',
    'ticket:view', 'ticket:edit', 'ticket:add', 'ticket:delete', 'ticket:edit_state',
    'user:view', 'users:view', 'user:edit', 'user:add', 'user:delete'
];

const REGULAR_PERMS: Permission[] = [
    'group:view',
    'ticket:view',
    'ticket:edit_state',
    'user:view',
    'user:edit'
];

export interface AppUser {
    username: string;
    email: string;
    fullName: string;
    phone: string;
    role: UserRole;
    permissions?: Permission[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    // usuario actual (null si no hay sesión)
    currentUser = signal<AppUser | null>(null);

    // Usuarios mockeados
    public readonly MOCK_USERS = [
        {
            email: 'pansotic29@gmail.com', // Admin
            pass: 'Admin@12345!',
            data: {
                username: 'admin_panso',
                email: 'pansotic29@gmail.com',
                fullName: 'Administrador Panso',
                phone: '4421234567',
                role: 'admin' as UserRole,
                permissions: ADMIN_PERMS
            }
        },
        {
            email: 'usuario@ejemplo.com', // Common user
            pass: 'User@12345!',
            data: {
                username: 'usuario_demo',
                email: 'usuario@ejemplo.com',
                fullName: 'Usuario Demo',
                phone: '4427654321',
                role: 'user' as UserRole,
                permissions: REGULAR_PERMS
            }
        }
    ];

    login(email: string, password: string): boolean {
        const foundUser = this.MOCK_USERS.find(u => u.email === email && u.pass === password);

        if (!foundUser) return false;

        // aquí “simulamos” datos del usuario
        this.currentUser.set({ ...foundUser.data });

        return true;
    }

    logout(): void {
        this.currentUser.set(null);
    }

    isLoggedIn(): boolean {
        return this.currentUser() !== null;
    }
}