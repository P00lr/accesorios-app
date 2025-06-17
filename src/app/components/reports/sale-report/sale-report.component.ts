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
import Swal from 'sweetalert2';
import { MatIcon } from '@angular/material/icon';

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
    MatProgressSpinnerModule,
    MatIcon
  ],
  templateUrl: './sale-report.component.html',
  styleUrl: './sale-report.component.css'
})
export class SaleReportComponent {
  reportForm: FormGroup;
  loading = false;
  errorMessage = '';

  pdfBlob: Blob | null = null;

  emailInput = '';
  emailRecipients: string[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.reportForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      subject: ['Reporte de Ventas', Validators.required],
      body: ['Adjunto el reporte solicitado.', Validators.required]
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

    this.http.get('https://backend-api-gestion-accesorios.onrender.com/api/sales/report', {
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

  addEmail(): void {
    const email = this.emailInput.trim();
    if (email && !this.emailRecipients.includes(email)) {
      this.emailRecipients.push(email);
    }
    this.emailInput = '';
  }

  removeEmail(email: string): void {
    this.emailRecipients = this.emailRecipients.filter(e => e !== email);
  }

  sendByEmail(): void {
    if (this.reportForm.invalid) {
      Swal.fire('❌ Fechas requeridas', 'Selecciona un rango de fechas válido.', 'warning');
      return;
    }

    if (this.emailRecipients.length === 0) {
      Swal.fire('❌ Correos requeridos', 'Agrega al menos un correo electrónico.', 'warning');
      return;
    }

    const { from, to, subject, body } = this.reportForm.value;
    const inicio = new Date(from).toISOString();
    const fin = new Date(to).toISOString();

    const requests = this.emailRecipients.map(destinatario =>
      this.http.post('https://backend-api-gestion-accesorios.onrender.com/api/email/sale', null, {
        params: {
          destinatario,
          inicio,
          fin,
          asunto: subject,
          mensaje: body
        },
        responseType: 'text'
      }).toPromise()
    );

    this.loading = true;
    Promise.all(requests)
      .then(() => {
        this.loading = false;
        Swal.fire('📧 Éxito', 'Reportes enviados correctamente.', 'success');
      })
      .catch(err => {
        this.loading = false;
        console.error(err);
        Swal.fire('❌ Error', err?.error || 'Ocurrió un error al enviar uno o más correos.', 'error');
      });
  }

  handleEmailEnter(event: Event): void {
    event.preventDefault(); // funciona aunque sea Event
    this.addEmail();
  }



}

