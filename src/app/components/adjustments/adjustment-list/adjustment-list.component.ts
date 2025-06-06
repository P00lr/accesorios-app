import { Component } from '@angular/core';
import { AdjustmentService } from '../../../services/adjustment.service';
import { Adjustment } from '../../../models/list-adjustment.model';
import { Page } from '../../../models/page.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-adjustment-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './adjustment-list.component.html',
  styleUrl: './adjustment-list.component.css'
})
export class AdjustmentListComponent {
  adjustments: Adjustment[] = [];
  currentPage = 0;
  totalPages = 0;
  permissions: string[] = [];


  constructor(
    private adjustmentService: AdjustmentService,
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.permissions$.subscribe(perms => {
        this.permissions = perms;
      });
  }


  ngOnInit(): void {
    this.loadAdjustments(this.currentPage);
  }

  hasPermission(permission: string): boolean {
      return this.permissions.includes(permission);
    }

  loadAdjustments(page: number): void {
    this.adjustmentService.getAdjustments(page).subscribe({
      next: (response: Page<Adjustment>) => {
        this.adjustments = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
      },
      error: error => {
        console.error('Error al cargar los ajustes', error);
      }
    });
  }

  viewDetails(id: number) {
    return this.router.navigate(['/adjustments/detail', id]);
  }
  deleteAdjustmen(id: number) {
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
            this.adjustmentService.deleteAdjustment(id).subscribe(() => {
              this.adjustments = this.adjustments.filter(adjustment => adjustment.id !== id);
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
      this.loadAdjustments(page);
    }
  }
}
