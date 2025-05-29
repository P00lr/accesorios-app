import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../../services/sale.service';
import { GetSale } from '../../../models/get-sale.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-sale-detail',
  imports: [
    RouterModule,
    CommonModule,
    MatTableModule,
    MatDividerModule,
    MatProgressSpinnerModule],
  templateUrl: './sale-detail.component.html',
  styleUrl: './sale-detail.component.css'
})
export class SaleDetailComponent implements OnInit {

  sale!: GetSale;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private saleService: SaleService,
    private router: ActivatedRoute
  ) {}

  ngOnInit(): void {
      const id = this.router.snapshot.paramMap.get('id');
      if(id) {
        this.saleService.getSaleById(+id).subscribe({
          next: (sale) => {
            this.sale = sale;
            this.loading = false;
          },
          error: () => {
            this.error = 'No se puede cargar la venta';
            this.loading = false;
          }
        }) 
      }
  }
}
