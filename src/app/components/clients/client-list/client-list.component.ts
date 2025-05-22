import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
  imports: [RouterModule]
})
export class ClientListComponent implements OnInit {

  clients: Client[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  isLoading = true;
  error: string | null = null;

  constructor(private clientService: ClientService, private router: Router) { }

  ngOnInit(): void {
    this.loadClients(this.currentPage);
  }

  loadClients(page: number): void {
    this.isLoading = true;
    this.clientService.getClients(page).subscribe({
      next: (response) => {
        this.clients = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los clientes.';
        this.isLoading = false;
      }
    });
  }

  deleteClient(id: number): void {
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
        this.clientService.deleteClient(id).subscribe(() => {
        this.clients = this.clients.filter(client => client.id !== id);
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

  viewDetails(id: number): void {
    this.router.navigate(['/clientes/detail', id]);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadClients(page);
    }
  }

}
