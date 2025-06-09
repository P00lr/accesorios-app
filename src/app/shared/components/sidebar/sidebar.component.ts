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

  hasAnyModulePermission(): boolean {
  const permissions = ['DASHBOARD', 'VER_PROVEEDOR', 'VER_CATEGORIA', 'VER_ACCESORIO'];
  return permissions.some(p => this.hasPermission(p));
}

hasAnyGestionPermission(): boolean {
  const permissions = ['VER_ALMACEN', 'VER_COMPRA', 'VER_VENTA'];
  return permissions.some(p => this.hasPermission(p));
}

hasAnyInventarioPermission(): boolean {
  const permissions = ['VER_AJUSTE', 'VER_TRASPASO'];
  return permissions.some(p => this.hasPermission(p));
}

hasAnyReportePermission(): boolean {
  const permissions = ['REPORTE_VENTA', 'REPORTE_ALMACEN'];
  return permissions.some(p => this.hasPermission(p));
}

hasAnyConfiguracionPermission(): boolean {
  const permissions = ['VER_USUARIO', 'VER_PERMISO', 'VER_ROL'];
  return permissions.some(p => this.hasPermission(p));
}


}
