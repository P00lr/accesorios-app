import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
 
  
  permissions: string[] = [];
  constructor(public authService: AuthService) {
    this.authService.permissions$.subscribe(perms => {
      this.permissions = perms;
    });
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }
}
