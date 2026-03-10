import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';

import { AuthService } from '../../../services/auth.service';

interface Ticket {
  id: string;
  title: string;
  state: 'Pendiente' | 'En progreso' | 'Revisión' | 'Hecho';
  assignee: string;
  priority: 'Alta' | 'Media' | 'Baja';
  createdAt: string;
  description?: string;
  dueDate?: string;
  llmModel?: string;
}

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    CardModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule
  ],
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.css'],
})
export class Tickets {
  private auth = inject(AuthService);
  currentUser = this.auth.currentUser()!;

  // Initial mocked tickets
  tickets: Ticket[] = [
    { id: 'TCK-001', title: 'Fix login bug', state: 'Pendiente', assignee: 'pansotic29@gmail.com', priority: 'Alta', createdAt: '2026-03-09', description: 'El botón de login no responde en Safari.', dueDate: '2026-03-12', llmModel: 'gpt-4o' },
    { id: 'TCK-002', title: 'Update user profile', state: 'En progreso', assignee: 'usuario@ejemplo.com', priority: 'Media', createdAt: '2026-03-08', description: 'Añadir campos de redes sociales al perfil.', dueDate: '2026-03-15', llmModel: 'claude-3.5-sonnet' },
    { id: 'TCK-003', title: 'Design new dashboard', state: 'Revisión', assignee: 'pansotic29@gmail.com', priority: 'Baja', createdAt: '2026-03-01', description: 'Revisión de mockups por parte del cliente.', dueDate: '2026-03-20', llmModel: 'gemini-1.5-pro' },
    { id: 'TCK-004', title: 'Add export to CSV', state: 'Hecho', assignee: 'usuario@ejemplo.com', priority: 'Media', createdAt: '2026-02-25', description: 'Exportar la tabla de ventas a formato CSV delimitado por comas.' },
    { id: 'TCK-005', title: 'Investigate DB slow queries', state: 'Pendiente', assignee: 'pansotic29@gmail.com', priority: 'Alta', createdAt: '2026-03-09', description: 'La vista de reportes tarda más de 10s en cargar los últimos 3 meses.' }
  ];

  // Logic to separate tickets into columns
  get pendiente() { return this.tickets.filter(t => t.state === 'Pendiente'); }
  get enProgreso() { return this.tickets.filter(t => t.state === 'En progreso'); }
  get revision() { return this.tickets.filter(t => t.state === 'Revisión'); }
  get hecho() { return this.tickets.filter(t => t.state === 'Hecho'); }

  connectedLists = ['pendienteList', 'enProgresoList', 'revisionList', 'hechoList'];

  stateOptions = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'En progreso', value: 'En progreso' },
    { label: 'Revisión', value: 'Revisión' },
    { label: 'Hecho', value: 'Hecho' }
  ];

  priorityOptions = [
    { label: 'Alta', value: 'Alta' },
    { label: 'Media', value: 'Media' },
    { label: 'Baja', value: 'Baja' }
  ];

  editDialogVisible = false;
  selectedTicket: Ticket | null = null;
  editingTicket: Partial<Ticket> = {};

  openTicket(ticket: Ticket) {
    this.selectedTicket = ticket;
    this.editingTicket = { ...ticket };
    this.editDialogVisible = true;
  }

  saveTicket() {
    if (this.selectedTicket) {
      Object.assign(this.selectedTicket, this.editingTicket);
    }
    this.editDialogVisible = false;
    this.selectedTicket = null;
  }

  cancelEdit() {
    this.editDialogVisible = false;
    this.selectedTicket = null;
  }

  drop(event: CdkDragDrop<Ticket[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update the ticket state when moved
      const ticket = event.container.data[event.currentIndex];
      const newStatusId = event.container.id;

      if (newStatusId === 'pendienteList') ticket.state = 'Pendiente';
      else if (newStatusId === 'enProgresoList') ticket.state = 'En progreso';
      else if (newStatusId === 'revisionList') ticket.state = 'Revisión';
      else if (newStatusId === 'hechoList') ticket.state = 'Hecho';
    }
  }

  getPrioritySeverity(priority: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    if (priority === 'Alta') return 'danger';
    if (priority === 'Media') return 'warn';
    return 'info';
  }
}

