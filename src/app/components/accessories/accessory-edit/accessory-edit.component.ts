import { Component } from '@angular/core';
import { CreateAccessory } from '../../../models/CreateAccessory.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccessoryService } from '../../../services/accessory.service';
import { Accessory } from '../../../models/accessory.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-accessory-edit',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './accessory-edit.component.html',
  styleUrl: './accessory-edit.component.css'
})
export class AccessoryEditComponent {
  accessoryId!: number;
  accessory: CreateAccessory = {
    name: '',
    price: 0,
    description: '',
    brand: '',
    model: '',
    categoryId: undefined,
  };

  categories: Category[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accessoryService: AccessoryService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.accessoryId = Number(this.route.snapshot.paramMap.get('id'));

    // Obtener categorías primero (opcional si ya están en localStorage)
    this.categoryService.getCategories(0).subscribe({
      next: (res) => (this.categories = res.content),
    });

    // Cargar accesorio por ID
    this.accessoryService.getAccessoryById(this.accessoryId).subscribe({
      next: (data: Accessory) => {
        this.accessory = {
          name: data.name,
          price: data.price,
          description: data.description,
          brand: data.brand,
          model: data.model,
          categoryId: data.categoryId, // ✅ ahora sí podemos asignarlo directamente
        };
        this.isLoading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el accesorio.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.accessoryService.updateAccessory(this.accessoryId, this.accessory as Accessory).subscribe({
      next: () => this.router.navigate(['/accessories']),
      error: () => (this.error = 'No se pudo actualizar el accesorio.')
    });
  }
}
