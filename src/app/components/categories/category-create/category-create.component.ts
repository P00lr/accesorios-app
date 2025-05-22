import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-create',
  standalone: true,
  templateUrl: './category-create.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class CategoryCreateComponent {
  categoryForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit() {
  if (this.categoryForm.valid) {
    const newCategory: Category = {
      id: 0,
      name: this.categoryForm.value.name
    };

    this.categoryService.createCategory(newCategory).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Categoría creada!',
          text: 'La categoría se ha creado correctamente',
          confirmButtonColor: '#198754',
          showConfirmButton: false,
          timer: 1200
        });
        this.categoryForm.reset();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al crear la categoría',
          confirmButtonColor: '#dc3545'
        });
        console.error(error);
      }
    });
  }
}

}
