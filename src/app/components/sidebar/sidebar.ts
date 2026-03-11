import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { AuthService, Permission } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() onToggle?: () => void;

  constructor(private auth: AuthService, private router: Router) { }

  groupsMenuExpanded = false;

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/'); // regresa al landing
  }

  toggleGroupsMenu() {
    this.groupsMenuExpanded = !this.groupsMenuExpanded;
  }

  canView(permission: Permission): boolean {
    const user = this.auth.currentUser();
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions?.includes(permission) || false;
  }
}