import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';

import { AuthService } from '../../../../services/auth.service';

interface GroupItem {
  id: string;
  nombre: string;
}

interface TicketItem {
  id: string;
  groupId: string;
  title: string;
  state: 'Pendiente' | 'En progreso' | 'Revisión' | 'Hecho' | 'Bloqueado';
  assignee: string;
  priority: 'Alta' | 'Media' | 'Baja';
  createdAt: string;
}

@Component({
  selector: 'app-group-tickets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    SelectModule,
    ButtonModule,
    CardModule,
    TagModule,
    AvatarModule
  ],
  templateUrl: './group-tickets.html',
  styleUrls: ['./group-tickets.css'],
})
export class GroupTickets implements OnInit {
  private auth = inject(AuthService);
  currentUser = this.auth.currentUser()!;

  groups: GroupItem[] = [
    { id: 'G-001', nombre: 'Administradores' },
    { id: 'G-002', nombre: 'Ventas' },
    { id: 'G-003', nombre: 'Soporte' },
    { id: 'G-004', nombre: 'Desarrollo' }
  ];

  selectedGroup: GroupItem | null = null;

  // Mocked tickets (now with groupId and a 'Bloqueado' state)
  allTickets: TicketItem[] = [
    { id: 'TCK-001', groupId: 'G-004', title: 'Fix login bug', state: 'Pendiente', assignee: 'pansotic29@gmail.com', priority: 'Alta', createdAt: '2026-03-09' },
    { id: 'TCK-002', groupId: 'G-002', title: 'Update CRM profile', state: 'En progreso', assignee: 'ventas@ejemplo.com', priority: 'Media', createdAt: '2026-03-08' },
    { id: 'TCK-003', groupId: 'G-004', title: 'Design new dashboard', state: 'Revisión', assignee: 'pansotic29@gmail.com', priority: 'Baja', createdAt: '2026-03-01' },
    { id: 'TCK-004', groupId: 'G-003', title: 'Support client login issue', state: 'Hecho', assignee: 'soporte@ejemplo.com', priority: 'Media', createdAt: '2026-02-25' },
    { id: 'TCK-005', groupId: 'G-004', title: 'Investigate DB slow queries', state: 'Bloqueado', assignee: 'pansotic29@gmail.com', priority: 'Alta', createdAt: '2026-03-09' },
    { id: 'TCK-006', groupId: 'G-001', title: 'Add new user permissions', state: 'Pendiente', assignee: 'admin@ejemplo.com', priority: 'Media', createdAt: '2026-03-10' },
    { id: 'TCK-007', groupId: 'G-003', title: 'Network outage report', state: 'En progreso', assignee: 'soporte@ejemplo.com', priority: 'Alta', createdAt: '2026-03-10' }
  ];

  // Lists for the kanban board that belong to the selected group
  pendiente: TicketItem[] = [];
  enProgreso: TicketItem[] = [];
  revision: TicketItem[] = [];
  hecho: TicketItem[] = [];
  bloqueado: TicketItem[] = [];

  connectedLists = ['pendienteList', 'enProgresoList', 'revisionList', 'hechoList', 'bloqueadoList'];

  ngOnInit() {
    // Opcional: auto-seleccionar el primer grupo
    // this.selectedGroup = this.groups[0];
    // this.onGroupChange();
  }

  onGroupChange() {
    this.refreshGroupTickets();
  }

  get totalTickets() {
    if (!this.selectedGroup) return 0;
    return this.pendiente.length + this.enProgreso.length + this.revision.length + this.hecho.length + this.bloqueado.length;
  }

  refreshGroupTickets() {
    if (!this.selectedGroup) {
      this.pendiente = [];
      this.enProgreso = [];
      this.revision = [];
      this.hecho = [];
      this.bloqueado = [];
      return;
    }

    const groupTickets = this.allTickets.filter(t => t.groupId === this.selectedGroup!.id);

    this.pendiente = groupTickets.filter(t => t.state === 'Pendiente');
    this.enProgreso = groupTickets.filter(t => t.state === 'En progreso');
    this.revision = groupTickets.filter(t => t.state === 'Revisión');
    this.hecho = groupTickets.filter(t => t.state === 'Hecho');
    this.bloqueado = groupTickets.filter(t => t.state === 'Bloqueado');
  }

  drop(event: CdkDragDrop<TicketItem[]>) {
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

      let newState: TicketItem['state'] = 'Pendiente';
      if (newStatusId === 'pendienteList') newState = 'Pendiente';
      else if (newStatusId === 'enProgresoList') newState = 'En progreso';
      else if (newStatusId === 'revisionList') newState = 'Revisión';
      else if (newStatusId === 'hechoList') newState = 'Hecho';
      else if (newStatusId === 'bloqueadoList') newState = 'Bloqueado';

      ticket.state = newState;

      // Update in the master list as well
      const index = this.allTickets.findIndex(t => t.id === ticket.id);
      if (index !== -1) {
        this.allTickets[index].state = newState;
      }
    }
  }

  getPrioritySeverity(priority: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    if (priority === 'Alta') return 'danger';
    if (priority === 'Media') return 'warn';
    return 'info';
  }

  createTicket() {
    if (!this.selectedGroup) return;
    alert(`Función para crear nuevo ticket para el grupo: ${this.selectedGroup.nombre}`);
  }
}
