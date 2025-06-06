import { Component } from '@angular/core';
import { AccessoryService } from '../../../services/accessory.service';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateAccessory } from '../../../models/CreateAccessory.model';
import { Category } from '../../../models/category.model';
import { map, Observable, startWith } from 'rxjs';
import { CategoryService } from '../../../services/category.service';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatAutocompleteModule, MatOption } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accessory-create',
  imports: [
    ReactiveFormsModule, 
    FormsModule, 
    CommonModule, 
    RouterModule,
    MatFormFieldModule,
    MatLabel,
    MatAutocompleteModule,
    MatOptionModule,
    MatInputModule
  ],
  templateUrl: './accessory-create.component.html',
  styleUrl: './accessory-create.component.css'
})
export class AccessoryCreateComponent {
  accessory: CreateAccessory = {
    name: '',
    price: 0,
    description: '',
    brand: '',
    model: '',
    categoryId: undefined
  };

  categoryControl = new FormControl('');
  categories: Category[] = [];
  filteredCategories!: Observable<Category[]>;

  error: string | null = null;

  constructor(
    private accessoryService: AccessoryService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.filteredCategories = this.categoryControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCategories(value || ''))
        );
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  private _filterCategories(value: string): Category[] {
    const filterValue = value.toLowerCase();
    return this.categories.filter(category =>
      category.name.toLowerCase().includes(filterValue)
    );
  }

  onCategorySelected(categoryName: string): void {
    const selectedCategory = this.categories.find(cat => cat.name === categoryName);
    this.accessory.categoryId = selectedCategory?.id;
  }

  onSubmit(): void {
  this.accessoryService.createAccessory(this.accessory).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Accesorio creado',
        text: 'El accesorio se ha creado correctamente.',
        showConfirmButton: false,
        timer: 1400
      }).then(() => {
        this.router.navigate(['/accessories']);
      });
    },
    error: (err) => {
      console.error(err);
      this.error = 'Error al crear el accesorio.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al crear el accesorio.',
        confirmButtonText: 'Cerrar'
      });
    }
  });
}

}
