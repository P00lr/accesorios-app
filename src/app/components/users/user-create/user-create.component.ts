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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      enable: [true]
    });
  }

  onSubmit(): void {
  if (this.userForm.invalid) {
    Swal.fire({
      icon: 'warning',
      title: 'Formulario inválido',
      text: 'Por favor, completa todos los campos requeridos.',
      confirmButtonText: 'Entendido'
    });
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
}
