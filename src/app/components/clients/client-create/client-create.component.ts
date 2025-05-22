import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule ]
})
export class ClientCreateComponent implements OnInit {
  clientForm!: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', Validators.required],
      preferredTheme: ['light'],
      autoThemeByHour: [false]
    });
  }

  onSubmit(): void {
  if (this.clientForm.invalid) return;

  this.clientService.createClient(this.clientForm.value).subscribe({
    next: () => {
      Swal.fire({
        title: 'Cliente creado con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        timer: 2000,
        timerProgressBar: true
      }).then(() => {
        this.router.navigate(['/clientes']);
      });
    },
    error: (err) => {
      console.error('Error al crear cliente:', err);
      this.errorMessage = 'Hubo un error al crear el cliente';
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al crear el cliente',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  });
}

}
