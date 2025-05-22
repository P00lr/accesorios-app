import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentDetailComponent } from './adjustment-detail.component';

describe('AdjustmentDetailComponent', () => {
  let component: AdjustmentDetailComponent;
  let fixture: ComponentFixture<AdjustmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjustmentDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
