import { Component } from '@angular/core';
import { AccessoryService } from '../../services/accessory.service';
import { AccessoryCatalog } from '../../models/accessory-catalog.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {

  clickedButtons = new Set<number>();

  accessories: AccessoryCatalog[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 7;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private accessoryService: AccessoryService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadAccessories(this.currentPage);
  }

  loadAccessories(page: number): void {
    this.loading = true;
    this.error = null;
    this.accessoryService.getAccessoriesCatalog(page).subscribe({
      next: (response) => {
        this.accessories = response.content;
        this.currentPage = response.number;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando el catálogo';
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.loadAccessories(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.loadAccessories(this.currentPage - 1);
    }
  }


  addToCart(accessory: AccessoryCatalog) {
    this.cartService.addToCart(accessory);

    // Añade la clase para animar
    this.clickedButtons.add(accessory.id);

    // Remueve la clase después de la animación (400ms)
    setTimeout(() => {
      this.clickedButtons.delete(accessory.id);
    }, 400);
  }
}
