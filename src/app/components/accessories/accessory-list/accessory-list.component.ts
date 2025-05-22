import { Component, OnInit } from '@angular/core';
import { Accessory } from '../../../models/accessory.model';
import { AccessoryService } from '../../../services/accessory.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accessory-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './accessory-list.component.html',
  styleUrl: './accessory-list.component.css'
})
export class AccessoryListComponent implements OnInit{
  accessories: Accessory[] = [];
  isLoading = true;
  error: string | null = null;

  currentPage = 0;
  totalPages = 0;

  constructor(
    private accessoryService: AccessoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAccessories(this.currentPage);
  }

  loadAccessories(page: number): void {
    this.isLoading = true;
    this.accessoryService.getAccesories(page).subscribe({
      next: (response) => {
        this.accessories = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Error al cargar los accesorios.';
        this.isLoading = false;
      }
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/accessories/detail', id]);
  }
  deleteAccessory(id: number) {
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
            this.accessoryService.deleteAccessory(id).subscribe(() => {
              this.accessories = this.accessories.filter(accessory => accessory.id !== id);
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
    if (page >= 0 && page < this.totalPages) {
      this.loadAccessories(page);
    }
  }
}
