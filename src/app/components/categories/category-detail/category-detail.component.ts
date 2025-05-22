import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CategoryDetailComponent implements OnInit {
  category!: Category;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.categoryService.getCategoryById(id).subscribe((data) => {
      this.category = data;
    });
  }

  goBack(): void {
    this.router.navigate(['/categorias']);
  }

  editCategory(): void {
    this.router.navigate(['/categorias/edit', this.category.id]);
  }
}
