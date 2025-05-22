import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdjustmentService } from '../../../services/adjustment.service';
import { GetAdjustment } from '../../../models/get-adjustmen.modl';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adjustment-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './adjustment-detail.component.html',
  styleUrl: './adjustment-detail.component.css'
})
export class AdjustmentDetailComponent {
  adjustmentId!: number;
  adjustment?: GetAdjustment;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private adjustmentService: AdjustmentService
  ) {}

  ngOnInit(): void {
    this.adjustmentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.adjustmentId) {
      this.loadAdjustment();
    } else {
      this.errorMessage = 'ID de ajuste no válido';
    }
  }

  loadAdjustment(): void {
    this.loading = true;
    this.adjustmentService.getAdjustmentById(this.adjustmentId).subscribe({
      next: (data) => {
        this.adjustment = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar el ajuste';
        console.error(error);
        this.loading = false;
      }
    });
  }
}
