import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryEditComponent } from './accessory-edit.component';

describe('AccessoryEditComponent', () => {
  let component: AccessoryEditComponent;
  let fixture: ComponentFixture<AccessoryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessoryEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
