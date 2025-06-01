import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-edit',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.css'
})
export class ClientEditComponent {
  clientForm!: FormGroup;
  clientId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.clientId = +this.route.snapshot.paramMap.get('id')!;
    
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fechaNacimiento: [''],
      preferredTheme: ['light'],
      autoThemeByHour: [false]
    });

    this.clientService.getClientById(this.clientId).subscribe((client: Client) => {
      this.clientForm.patchValue(client);
    });
  }

  onSubmit(): void {
  if (this.clientForm.valid) {
    const updatedClient = this.clientForm.value;
    this.clientService.updateClient(this.clientId, updatedClient).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Cliente actualizado',
        text: 'El cliente se actualizó correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.router.navigate(['/clientes']);
      });
    });
  }
}
  
}
