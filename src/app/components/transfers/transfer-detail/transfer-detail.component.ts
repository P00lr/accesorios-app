import { Component } from '@angular/core';
import { GetTransfer } from '../../../models/get-transfer.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TransferService } from '../../../services/transfer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transfer-detail',
  imports: [RouterModule, CommonModule],
  templateUrl: './transfer-detail.component.html',
  styleUrl: './transfer-detail.component.css'
})
export class TransferDetailComponent {
  transfer!: GetTransfer;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private transferService: TransferService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.transferService.getTransferById(id).subscribe({
        next: (data) => {
          this.transfer = data;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Error al cargar el detalle del traspaso';
          this.loading = false;
        }
      });
    }
  }
}
