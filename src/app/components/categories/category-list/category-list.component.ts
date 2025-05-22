import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { Category } from '../../../models/category.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  imports: [CommonModule, RouterModule]
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];
  currentPage = 0;
  totalPages = 0;

  constructor(private categoryService: CategoryService, private router: Router) { }

  ngOnInit(): void {
    this.loadCategories(this.currentPage);
  }

  loadCategories(page: number): void {
    this.categoryService.getCategories(page).subscribe({
      next: (response) => {
        this.categories = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.categoryService.setClientsToLocalStorage(response.content); // Guarda localmente si se requiere
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
      }
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/categories/detail', id]);
  }

  deleteCategory(id: number): void {
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
              this.categoryService.deleteCategory(id).subscribe(() => {
              this.categories = this.categories.filter(category => category.id !== id);
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
      this.loadCategories(page);
    }
  }

}
