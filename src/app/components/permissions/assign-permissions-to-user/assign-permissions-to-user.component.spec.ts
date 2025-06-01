import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPermissionsToUserComponent } from './assign-permissions-to-user.component';

describe('AssignPermissionsToUserComponent', () => {
  let component: AssignPermissionsToUserComponent;
  let fixture: ComponentFixture<AssignPermissionsToUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignPermissionsToUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignPermissionsToUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
