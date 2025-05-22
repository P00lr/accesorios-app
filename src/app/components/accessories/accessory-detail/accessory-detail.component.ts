import { Component } from '@angular/core';
import { Accessory } from '../../../models/accessory.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccessoryService } from '../../../services/accessory.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accessory-detail',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './accessory-detail.component.html',
  styleUrl: './accessory-detail.component.css'
})
export class AccessoryDetailComponent {
  accessory: Accessory | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private accessoryService: AccessoryService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.accessoryService.getAccessoryById(id).subscribe({
        next: (data) => {
          this.accessory = data;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar el accesorio.';
          this.isLoading = false;
        }
      });
    }
  }
}
