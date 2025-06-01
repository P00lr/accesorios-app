import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPermissionsToRoleComponent } from './assign-permissions-to-role.component';

describe('AssignPermissionsToRoleComponent', () => {
  let component: AssignPermissionsToRoleComponent;
  let fixture: ComponentFixture<AssignPermissionsToRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignPermissionsToRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignPermissionsToRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
