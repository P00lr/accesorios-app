import { Component } from '@angular/core';
import { User } from '../../../models/user.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-user-edit',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {
  userId!: number;
  user: User = {
    id: 0,
    name: '',
    username: '',
    password: '',
    email: '',
    enabled: true
  };

  isLoading = true;
  error: string | null = null;
  //para el cambio de contraseña
  passwordData = {
    userId: 0,
    currentPassword: '',
    newPassword: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getUserById(this.userId).subscribe({
      next: (data: User) => {
        this.user = { ...data, password: '' }; // No mostrar contraseña
        this.passwordData.userId = data.id;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el usuario.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
  this.userService.updateUser(this.userId, this.user).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado',
        text: 'El usuario se actualizó correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.router.navigate(['/users']);
      });
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el usuario. Intenta nuevamente.',
        confirmButtonText: 'Aceptar'
      });
    }
  });
}


  onChangePassword(): void {
  // Opcional: validar que los campos no estén vacíos
  if (!this.passwordData.currentPassword || !this.passwordData.newPassword) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos vacíos',
      text: 'Por favor ingresa la contraseña actual y la nueva.',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'top'
    });
    return;
  }

  this.userService.changePassword({
    userId: this.user.id,
    currentPassword: this.passwordData.currentPassword,
    newPassword: this.passwordData.newPassword
  }).subscribe({
    next: () => {
      Swal.fire({
        title: 'Contraseña actualizada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        position: 'top',
        didClose: () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
      this.passwordData = { userId: this.user.id, currentPassword: '', newPassword: '' };
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error || 'Algo salió mal al actualizar la contraseña.',
        position: 'top'
      });
    }
  });
}


}
