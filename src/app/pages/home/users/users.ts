import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

import { MessageService } from 'primeng/api';

type TagSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined;

import { AuthService } from '../../../services/auth.service';

type Role = 'admin' | 'user';
type Status = 'Activo' | 'Pausado' | 'Inactivo';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    CardModule,
    AvatarModule,
    DividerModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    TagModule,
    ToolbarModule,
    PanelModule,
    ToastModule,
    DialogModule
  ],
  providers: [MessageService],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class Users {

  private auth = inject(AuthService);
  private msg = inject(MessageService);

  currentUser = this.getUserSafe();

  q = '';

  editDialogVisible = false;
  editingUser: any = {};

  openEdit() {
    this.editingUser = { ...this.currentUser };
    this.editDialogVisible = true;
  }

  saveEdit() {
    this.currentUser = { ...this.currentUser, ...this.editingUser };
    this.editDialogVisible = false;
    this.msg.add({ severity: 'success', summary: 'Actualizado', detail: 'Datos del usuario guardados' });
  }

  deactivateUser() {
    this.currentUser.status = 'Inactivo';
    this.msg.add({ severity: 'warn', summary: 'Usuario dado de baja', detail: 'El usuario ha sido desactivado exitosamente' });
  }

  activity = [
    { action: 'Inicio de sesión', date: 'Hoy', status: 'OK' },
    { action: 'Accedió a Users', date: 'Hoy', status: 'OK' },
    { action: 'Accedió a Groups', date: 'Hoy', status: 'OK' },
    { action: 'Cambió vista', date: 'Hoy', status: 'OK' }
  ];

  permissions = this.currentUser.permissions.map(p => {
    let module = 'General';
    if (p.startsWith('group')) module = 'Groups';
    if (p.startsWith('ticket')) module = 'Ticket';
    if (p.startsWith('user')) module = 'Users';
    return {
      module,
      name: p,
      role: this.currentUser.role,
      status: 'Activo' as Status
    };
  });

  // Signal computed
  filteredPermissions = computed(() => {
    const s = this.q.trim().toLowerCase();
    if (!s) return this.permissions;
    return this.permissions.filter(p => p.name.toLowerCase().includes(s) || p.module?.toLowerCase().includes(s));
  });

  roleSeverity(role: Role): TagSeverity {
    return role === 'admin' ? 'info' : 'warn';
  }

  statusSeverity(status: Status): TagSeverity {
    if (status === 'Activo') return 'success';
    if (status === 'Pausado') return 'warn';
    return 'danger';
  }

  showToast() {
    this.msg.add({
      severity: 'success',
      summary: 'Perfil cargado',
      detail: 'Usuario cargado correctamente'
    });
  }

  private getUserSafe() {
    const u = this.auth.currentUser();

    const email = u?.email || 'pansotic29@gmail.com';

    return {
      username: u?.username || 'Panso',
      fullName: u?.fullName || 'Panso TIC',
      email,
      phone: u?.phone || '4420000000',
      address: 'Querétaro, México', // Assuming address and birthDate are static or not in auth user for now
      birthDate: '1990-01-01',
      role: (u?.role || 'admin') as Role,
      status: 'Activo' as Status,
      permissions: u?.permissions || [
        'group:view', 'group:edit', 'group:add', 'group:delete',
        'ticket:view', 'ticket:edit', 'ticket:add', 'ticket:delete', 'ticket:edit_state',
        'user:view', 'users:view', 'user:edit', 'user:add', 'user:delete'
      ]
    };
  }
}