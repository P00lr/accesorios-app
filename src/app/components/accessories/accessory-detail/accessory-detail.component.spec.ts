import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryDetailComponent } from './accessory-detail.component';

describe('AccessoryDetailComponent', () => {
  let component: AccessoryDetailComponent;
  let fixture: ComponentFixture<AccessoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessoryDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
