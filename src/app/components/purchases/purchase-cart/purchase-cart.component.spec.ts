import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCartComponent } from './purchase-cart.component';

describe('PurchaseCartComponent', () => {
  let component: PurchaseCartComponent;
  let fixture: ComponentFixture<PurchaseCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
