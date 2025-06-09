import { Component } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-create',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {
  userForm!: FormGroup;
  errorMessage = '';

  failedAttempts = 0;
  isBlocked = false;


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-\.])[A-Za-z\d@$!%*?&_\-\.]+$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      enable: [true]
    });
  }


  onSubmit(): void {
    if (this.isBlocked) {
      Swal.fire({
        icon: 'error',
        title: 'Cuenta bloqueada',
        text: 'Has superado el número de intentos permitidos. Intenta nuevamente en 30 segundos.',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (this.userForm.invalid) {
      this.failedAttempts++;

      if (this.failedAttempts >= 3) {
        this.isBlocked = true;
        setTimeout(() => {
          this.failedAttempts = 0;
          this.isBlocked = false;
        }, 30000); // 30 segundos

        Swal.fire({
          icon: 'error',
          title: 'Demasiados intentos',
          text: 'Tu cuenta ha sido bloqueada temporalmente por seguridad.',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Formulario inválido',
          text: 'Por favor, completa todos los campos requeridos con una contraseña segura.',
          confirmButtonText: 'Entendido'
        });
      }
      return;
    }

    this.userService.createUser(this.userForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'Usuario ha sido registrado correctamente.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/users']);
        });
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.errorMessage = 'Hubo un error al crear el usuario';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al registrar el usuario.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }


  get password(): string {
    return this.userForm.get('password')?.value || '';
  }

  get hasMinLength(): boolean {
    return this.password.length >= 8;
  }

  get hasUpperCase(): boolean {
    return /[A-Z]/.test(this.password);
  }

  get hasLowerCase(): boolean {
    return /[a-z]/.test(this.password);
  }

  get hasNumber(): boolean {
    return /\d/.test(this.password);
  }

  get hasSpecialChar(): boolean {
    return /[@$!%*?&_\-\.]/.test(this.password);
  }


}
