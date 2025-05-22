import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRoleWithPermissionsComponent } from './list-role-with-permissions.component';

describe('ListRoleWithPermissionsComponent', () => {
  let component: ListRoleWithPermissionsComponent;
  let fixture: ComponentFixture<ListRoleWithPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRoleWithPermissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRoleWithPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
