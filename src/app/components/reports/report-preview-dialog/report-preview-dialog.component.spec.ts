import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPreviewDialogComponent } from './report-preview-dialog.component';

describe('ReportPreviewDialogComponent', () => {
  let component: ReportPreviewDialogComponent;
  let fixture: ComponentFixture<ReportPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPreviewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
