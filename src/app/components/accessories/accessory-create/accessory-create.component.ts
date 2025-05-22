import { Component } from '@angular/core';
import { Accessory } from '../../../models/accessory.model';
import { AccessoryService } from '../../../services/accessory.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateAccessory } from '../../../models/CreateAccessory.model';

@Component({
  selector: 'app-accessory-create',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
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

  error: string | null = null;

  constructor(
    private accessoryService: AccessoryService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.accessoryService.createAccessory(this.accessory).subscribe({
      next: () => this.router.navigate(['/accessories']),
      error: (err) => {
        console.error(err);
        this.error = 'Error al crear el accesorio.';
      }
    });
  }
}
