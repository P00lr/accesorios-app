import { Component } from '@angular/core';
import { GetPurchase } from '../../../models/get-purchase.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PurchaseService } from '../../../services/purchase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchase-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './purchase-detail.component.html',
  styleUrl: './purchase-detail.component.css'
})
export class PurchaseDetailComponent {
  purchase!: GetPurchase;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private purchaseService: PurchaseService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.purchaseService.getPurchaseById(+id).subscribe({
        next: (data) => {
          this.purchase = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar la compra.';
          this.loading = false;
        }
      });
    }
  }
}
