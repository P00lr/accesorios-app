import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../models/user.model';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users: User[] = [];
  currentPage = 0;
  totalPages = 0;
  isLoading = true;
  error: string | null = null;
  permissions: string[] = [];


  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) { 
    this.authService.permissions$.subscribe(perms => {
        this.permissions = perms;
      });
  }

  ngOnInit(): void {
    this.loadUsers(this.currentPage);
  }

  hasPermission(permission: string): boolean {
      return this.permissions.includes(permission);
  }

  loadUsers(page: number): void {
    this.isLoading = true;
    this.userService.getUsers(page).subscribe({
      next: (response) => {
        this.users = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Error al cargar los usuarios.';
        this.isLoading = false;
      }
    });
  }

  viewDetails(id: number) {
    this.router.navigate(['/users/detail', id]);
  }

  deleteUser(id: number) {
    Swal.fire({
          title: "Estas seguro que deseas eliminar?",
          text: "Se eliminara de forma permanente!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "SI, Eliminar!"
        }).then((result) => {
          if (result.isConfirmed) {
            this.userService.deleteUser(id).subscribe(() => {
            this.users = this.users.filter(user => user.id !== id);
          });
            Swal.fire({
              title: "Eliminado!",
              text: "Eliminado exitosamente.",
              icon: "success",
              showConfirmButton: false,
              timer: 800
            });
          }
        });
  }
      goToPage(page: number): void {
        if(page >= 0 && page < this.totalPages) {
      this.loadUsers(page);
    }
  }
}
