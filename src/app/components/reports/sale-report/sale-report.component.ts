import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReportPreviewDialogComponent } from '../report-preview-dialog/report-preview-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sale-report',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './sale-report.component.html',
  styleUrl: './sale-report.component.css'
})
export class SaleReportComponent {
  reportForm: FormGroup;
  loading = false;
  errorMessage = '';

  pdfBlob: Blob | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.reportForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required]
    });
  }

  openPreview() {
    if (this.reportForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { from, to } = this.reportForm.value;

    const params = new HttpParams()
      .set('from', new Date(from).toISOString())
      .set('to', new Date(to).toISOString());

    this.http.get('http://localhost:8080/api/sales/report', {
      params,
      responseType: 'blob'
    }).subscribe({
      next: (pdf) => {
        this.loading = false;
        this.pdfBlob = pdf;
        this.dialog.open(ReportPreviewDialogComponent, {
          width: '80%',
          maxWidth: '900px',
          data: { blob: this.pdfBlob, onDownload: () => this.downloadReport() }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Error al generar el reporte.';
        console.error(err);
      }
    });
  }

  downloadReport() {
    if (this.pdfBlob) {
      saveAs(this.pdfBlob, 'reporte_ventas.pdf');
    }
  }
}

