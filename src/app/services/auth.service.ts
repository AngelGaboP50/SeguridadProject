import { Injectable } from '@angular/core';

export type RegisteredUser = {
    username: string;
    email: string;
    password: string;
    fullName: string;
    address: string;
    phone: string;
    birthDate: Date;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
    // ✅ Credenciales hardcodeadas para Login
    private readonly HARDCODED_EMAIL = 'Pansotic29@gmail.com';
    private readonly HARDCODED_PASSWORD = 'Prueba123*';

    // ✅ Aquí guardo el registro “en memoria” (y también lo guardo en localStorage)
    private readonly LS_KEY = 'erp_registered_user';

    login(email: string, password: string): boolean {
        return email === this.HARDCODED_EMAIL && password === this.HARDCODED_PASSWORD;
    }

    saveRegister(user: RegisteredUser): void {
        localStorage.setItem(this.LS_KEY, JSON.stringify(user));
    }

    getRegister(): RegisteredUser | null {
        const raw = localStorage.getItem(this.LS_KEY);
        return raw ? (JSON.parse(raw) as RegisteredUser) : null;
    }
}