import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryCreateComponent } from './accessory-create.component';

describe('AccessoryCreateComponent', () => {
  let component: AccessoryCreateComponent;
  let fixture: ComponentFixture<AccessoryCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessoryCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessoryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
