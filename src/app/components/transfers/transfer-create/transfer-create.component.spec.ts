import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCreateComponent } from './transfer-create.component';

describe('TransferCreateComponent', () => {
  let component: TransferCreateComponent;
  let fixture: ComponentFixture<TransferCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
