import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

type Estatus = 'Activo' | 'Pausado' | 'Inactivo';
type Nivel = 'Básico' | 'Intermedio' | 'Avanzado';

type GroupRow = {
  nombre: string;
  nivel: Nivel;
  autor: string;
  integrantes: number;
  tickets: number;
  descripcion: string;
  estatus: Estatus;
};

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    CardModule,
    TableModule,
    TagModule,
    ButtonModule,
    InputTextModule,
    ToolbarModule,
    DialogModule,
    SelectModule,
    InputNumberModule,
    TextareaModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './groups.html',
  styleUrls: ['./groups.css']
})
export class Groups {
  private msg = inject(MessageService);

  q = '';

  nivelOptions = [
    { label: 'Básico', value: 'Básico' as Nivel },
    { label: 'Intermedio', value: 'Intermedio' as Nivel },
    { label: 'Avanzado', value: 'Avanzado' as Nivel }
  ];

  statusOptions = [
    { label: 'Activo', value: 'Activo' as Estatus },
    { label: 'Pausado', value: 'Pausado' as Estatus },
    { label: 'Inactivo', value: 'Inactivo' as Estatus }
  ];

  groups: GroupRow[] = [
    {
      nombre: 'Administradores',
      nivel: 'Avanzado',
      autor: 'ERP System',
      integrantes: 3,
      tickets: 12,
      descripcion: 'Acceso total al sistema (demo).',
      estatus: 'Activo'
    },
    {
      nombre: 'Ventas',
      nivel: 'Intermedio',
      autor: 'ERP System',
      integrantes: 8,
      tickets: 7,
      descripcion: 'Gestión de ventas y reportes (demo).',
      estatus: 'Activo'
    },
    {
      nombre: 'Soporte',
      nivel: 'Intermedio',
      autor: 'ERP System',
      integrantes: 5,
      tickets: 21,
      descripcion: 'Atención a incidencias (demo).',
      estatus: 'Activo'
    },
    {
      nombre: 'Invitados',
      nivel: 'Básico',
      autor: 'ERP System',
      integrantes: 14,
      tickets: 0,
      descripcion: 'Acceso limitado (demo).',
      estatus: 'Pausado'
    }
  ];

  filtered = computed(() => {
    const s = this.q.trim().toLowerCase();
    if (!s) return this.groups;
    return this.groups.filter(g => g.nombre.toLowerCase().includes(s));
  });

  statusSeverity(status: Estatus): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (status) {
      case 'Activo': return 'success';
      case 'Pausado': return 'warn';
      case 'Inactivo': return 'danger';
      default: return 'info';
    }
  }

  // --- Modal demo (CRUD visual)
  dialogOpen = false;
  isEdit = false;
  editIndex = -1;

  draft: GroupRow = this.emptyDraft();

  openCreate() {
    this.isEdit = false;
    this.editIndex = -1;
    this.draft = this.emptyDraft();
    this.dialogOpen = true;
  }

  openEdit(row: GroupRow) {
    this.isEdit = true;
    this.editIndex = this.groups.indexOf(row);
    this.draft = { ...row };
    this.dialogOpen = true;
  }

  save() {
    if (this.isEdit && this.editIndex >= 0) {
      this.groups[this.editIndex] = { ...this.draft };
      this.groups = [...this.groups];
    } else {
      this.groups = [{ ...this.draft }, ...this.groups];
    }
    this.dialogOpen = false;
  }

  remove(row: GroupRow) {
    this.groups = this.groups.filter(g => g !== row);
    this.msg.add({ severity: 'success', summary: 'Grupo eliminado', detail: 'El grupo ha sido eliminado exitosamente' });
  }

  private emptyDraft(): GroupRow {
    return {
      nombre: '',
      nivel: 'Básico',
      autor: 'ERP System',
      integrantes: 1,
      tickets: 0,
      descripcion: '',
      estatus: 'Activo'
    };
  }
}