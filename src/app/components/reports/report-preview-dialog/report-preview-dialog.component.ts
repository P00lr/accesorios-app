import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-report-preview-dialog',
  templateUrl: './report-preview-dialog.component.html',
  styleUrls: ['./report-preview-dialog.component.css'],
  imports: [
    MatDialogModule,
    MatButtonModule ,
    CommonModule,
  ]
})
export class ReportPreviewDialogComponent {
  pdfUrl: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ReportPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { blob: Blob; onDownload: () => void }
  ) {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(data.blob));
  }

  onClose() {
    this.dialogRef.close();
  }

  onDownload() {
    this.data.onDownload();
    this.dialogRef.close();
  }
}
