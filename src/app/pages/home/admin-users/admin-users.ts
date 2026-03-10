import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { AuthService, AppUser, UserRole } from '../../../services/auth.service';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [
        CommonModule, FormsModule, TableModule, ButtonModule, TagModule,
        DialogModule, InputTextModule, SelectModule, ToggleSwitchModule,
        MultiSelectModule, ConfirmDialogModule
    ],
    providers: [ConfirmationService],
    templateUrl: './admin-users.html',
    styleUrls: ['./admin-users.css']
})
export class AdminUsers implements OnInit {
    private auth = inject(AuthService);
    private confirmationService = inject(ConfirmationService);

    // Directly access the public MOCK_USERS to manipulate them
    usersList = this.auth.MOCK_USERS;

    editDialogVisible = false;
    editingUser: undefined | (Partial<AppUser> & { pass?: string, originalEmail?: string }) = undefined;
    isNewUser = false;

    roleOptions = [
        { label: 'Super Admin', value: 'superAdmin' },
        { label: 'Administrador', value: 'admin' },
        { label: 'Usuario', value: 'user' }
    ];

    // List of all customizable permissions
    availablePermissions = [
        { label: 'Ver Grupos', value: 'group:view' },
        { label: 'Editar Grupos', value: 'group:edit' },
        { label: 'Añadir Grupos', value: 'group:add' },
        { label: 'Eliminar Grupos', value: 'group:delete' },

        { label: 'Ver Tickets', value: 'ticket:view' },
        { label: 'Editar Tickets', value: 'ticket:edit' },
        { label: 'Crear Tickets', value: 'ticket:add' },
        { label: 'Borrar Tickets', value: 'ticket:delete' },
        { label: 'Cambiar Estado Ticket', value: 'ticket:edit_state' },

        { label: 'Ver Perfil/Usuarios', value: 'user:view' },
        { label: 'Ver Otros Usuarios', value: 'users:view' },
        { label: 'Editar Perfil', value: 'user:edit' },
        { label: 'Añadir Usuario', value: 'user:add' },
        { label: 'Borrar Usuario', value: 'user:delete' },
    ];

    ngOnInit() { }

    getSeverity(role: string) {
        if (role === 'superAdmin') return 'danger';
        if (role === 'admin') return 'warn';
        return 'info';
    }

    openCreateUser() {
        this.isNewUser = true;
        this.editingUser = {
            username: '',
            email: '',
            fullName: '',
            phone: '',
            role: 'user',
            permissions: [],
            pass: ''
        };
        this.editDialogVisible = true;
    }

    editUser(userRecord: any) {
        this.isNewUser = false;
        this.editingUser = {
            ...userRecord.data,
            pass: userRecord.pass,
            originalEmail: userRecord.email // used to find and replace
        };
        // Ensure permissions array exists
        if (!this.editingUser!.permissions) {
            this.editingUser!.permissions = [];
        }
        this.editDialogVisible = true;
    }

    saveUser() {
        if (!this.editingUser?.email || !this.editingUser?.fullName || !this.editingUser?.pass) {
            alert("Todos los campos obligatorios deben estar llenos.");
            return;
        }

        if (this.isNewUser) {
            const index = this.usersList.findIndex((u: any) => u.email === this.editingUser!.email);
            if (index !== -1) {
                alert('El correo ya existe.');
                return;
            }

            const newUser = {
                email: this.editingUser.email!,
                pass: this.editingUser.pass!,
                data: {
                    username: this.editingUser.username || this.editingUser.email!.split('@')[0],
                    email: this.editingUser.email!,
                    fullName: this.editingUser.fullName!,
                    phone: this.editingUser.phone || '',
                    role: this.editingUser.role!,
                    permissions: this.editingUser.permissions || []
                }
            };
            // Mutate array so view updates
            this.usersList.push(newUser);
        } else {
            const index = this.usersList.findIndex((u: any) => u.email === this.editingUser!.originalEmail);
            if (index !== -1) {
                this.usersList[index] = {
                    email: this.editingUser!.email!,
                    pass: this.editingUser!.pass!,
                    data: {
                        username: this.editingUser!.username || '',
                        email: this.editingUser!.email!,
                        fullName: this.editingUser!.fullName!,
                        phone: this.editingUser!.phone || '',
                        role: this.editingUser!.role!,
                        permissions: this.editingUser!.permissions || []
                    }
                };
            }
        }

        this.editDialogVisible = false;
        this.editingUser = undefined;
    }

    confirmDeleteOrDelete(userRecord: any, event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `¿Estás seguro de que deseas eliminar al usuario ${userRecord.email}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Cancelar',
            acceptLabel: 'Eliminar',
            acceptButtonStyleClass: "p-button-danger",
            accept: () => {
                const idx = this.usersList.findIndex((u: any) => u.email === userRecord.email);
                if (idx !== -1) {
                    this.usersList.splice(idx, 1);
                }
            }
        });
    }
}
