import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
})
export class CategoryEditComponent {
  categoryForm!: FormGroup;
  categoryId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.paramMap.get('id')!;

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.categoryService.getCategoryById(this.categoryId).subscribe((category: Category) => {
      this.categoryForm.patchValue(category);
    });
  }

  onSubmit(): void {
  if (this.categoryForm.valid) {
    const updatedCategory = this.categoryForm.value;
    this.categoryService.updateCategory(this.categoryId, updatedCategory).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Categoría actualizada',
          text: 'La categoría se actualizó correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/categories']);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la categoría. Intenta nuevamente.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
}
