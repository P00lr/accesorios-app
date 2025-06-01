import { Routes } from '@angular/router';
import { ClientListComponent } from './components/clients/client-list/client-list.component';
import { ClientCreateComponent } from './components/clients/client-create/client-create.component';
import { ClientEditComponent } from './components/clients/client-edit/client-edit.component';
import { SupplierListComponent } from './components/suppliers/supplier-list/supplier-list.component';
import { SupplierEditComponent } from './components/suppliers/supplier-edit/supplier-edit.component';
import { SupplierCreateComponent } from './components/suppliers/supplier-create/supplier-create.component';
import { ClientDetailComponent } from './components/clients/client-detail/client-detail.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryEditComponent } from './components/categories/category-edit/category-edit.component';
import { CategoryDetailComponent } from './components/categories/category-detail/category-detail.component';
import { CategoryCreateComponent } from './components/categories/category-create/category-create.component';
import { WarehouseListComponent } from './components/warehouses/warehouse-list/warehouse-list.component';
import { AccessoryListComponent } from './components/accessories/accessory-list/accessory-list.component';
import { WarehouseCreateComponent } from './components/warehouses/warehouse-create/warehouse-create.component';
import { WarehouseDetailComponent } from './components/warehouses/warehouse-detail/warehouse-detail.component';
import { WarehouseEditComponent } from './components/warehouses/warehouse-edit/warehouse-edit.component';
import { AccessoryCreateComponent } from './components/accessories/accessory-create/accessory-create.component';
import { AccessoryEditComponent } from './components/accessories/accessory-edit/accessory-edit.component';
import { AccessoryDetailComponent } from './components/accessories/accessory-detail/accessory-detail.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserDetailComponent } from './components/users/user-detail/user-detail.component';
import { UserCreateComponent } from './components/users/user-create/user-create.component';
import { UserEditComponent } from './components/users/user-edit/user-edit.component';
import { PurchaseDetailComponent } from './components/purchases/purchase-detail/purchase-detail.component';
import { PurchaseListComponent } from './components/purchases/purchase-list/purchase-list.component';
import { SaleDetailComponent } from './components/sales/sale-detail/sale-detail.component';
import { SaleListComponent } from './components/sales/sale-list/sale-list.component';
import { AdjustmentDetailComponent } from './components/adjustments/adjustment-detail/adjustment-detail.component';
import { AdjustmentListComponent } from './components/adjustments/adjustment-list/adjustment-list.component';
import { AdjustmentCreateComponent } from './components/adjustments/adjustment-create/adjustment-create.component';
import { TransferDetailComponent } from './components/transfers/transfer-detail/transfer-detail.component';
import { TransferListComponent } from './components/transfers/transfer-list/transfer-list.component';
import { TransferCreateComponent } from './components/transfers/transfer-create/transfer-create.component';
import { SaleReportComponent } from './components/reports/sale-report/sale-report.component';
import { PermissionListComponent } from './components/permissions/permission-list/permission-list.component';
import { PermissionCreateComponent } from './components/permissions/permission-create/permission-create.component';
import { RoleListComponent } from './components/roles/role-list/role-list.component';
import { RoleCreateComponent } from './components/roles/role-create/role-create.component';
import { ListRoleWithPermissionsComponent } from './components/roles/list-role-with-permissions/list-role-with-permissions.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { CartComponent } from './components/cart/cart.component';
import { PurchaseCartComponent } from './components/purchases/purchase-cart/purchase-cart.component';
import { AssignPermissionsToRoleComponent } from './components/permissions/assign-permissions-to-role/assign-permissions-to-role.component';
import { AssignPermissionsToUserComponent } from './components/permissions/assign-permissions-to-user/assign-permissions-to-user.component';
import { PermissionEditComponent } from './components/permissions/permission-edit/permission-edit.component';
import { RoleEditComponent } from './components/roles/role-edit/role-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  //CATALOG
  { path: 'catalog-accessories', component: CatalogComponent},

  //CART
  //CATALOG
  { path: 'cart', component: CartComponent},

  //CLIENT
  { path: 'clientes/detail/:id', component: ClientDetailComponent },
  { path: 'clientes', component: ClientListComponent },
  { path: 'clientes/create', component: ClientCreateComponent },
  { path: 'clientes/edit/:id', component: ClientEditComponent },
  //SUPPLIER
  { path: 'proveedores', component: SupplierListComponent },
  { path: 'proveedores/edit/:id', component: SupplierEditComponent },
  { path: 'proveedores/create', component: SupplierCreateComponent },
  //CATEGORIES
  { path: 'categories/detail/:id', component: CategoryDetailComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/create', component: CategoryCreateComponent },
  { path: 'categories/edit/:id', component: CategoryEditComponent },

  //WAREHOUSES
  { path: 'warehouses/detail/:id', component: WarehouseDetailComponent },
  { path: 'warehouses', component: WarehouseListComponent },
  { path: 'warehouses/create', component: WarehouseCreateComponent },
  { path: 'warehouses/edit/:id', component: WarehouseEditComponent },

  //ACCESORIES
  { path: 'accessories/detail/:id', component: AccessoryDetailComponent },
  { path: 'accessories', component: AccessoryListComponent },
  { path: 'accessories/create', component: AccessoryCreateComponent },
  { path: 'accessories/edit/:id', component: AccessoryEditComponent },

  //USERS
  { path: 'users/detail/:id', component: UserDetailComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/create', component: UserCreateComponent },
  { path: 'users/edit/:id', component: UserEditComponent },

  //PURCHASES
  { path: 'purchases/detail/:id', component: PurchaseDetailComponent },
  { path: 'purchases', component: PurchaseListComponent },
  { path: 'purchases/create', component: PurchaseCartComponent },

  //SALES
  { path: 'sales/detail/:id', component: SaleDetailComponent },
  { path: 'sales', component: SaleListComponent },
  { path: 'sales/create', component: CatalogComponent },

  //ADJUSTMENTS
  { path: 'adjustments/detail/:id', component: AdjustmentDetailComponent },
  { path: 'adjustments', component: AdjustmentListComponent },
  { path: 'adjustments/create', component: AdjustmentCreateComponent },

  //TRANSFERS
  { path: 'transfers/detail/:id', component: TransferDetailComponent },
  { path: 'transfers', component: TransferListComponent },
  { path: 'transfers/create', component: TransferCreateComponent },

  //PERMISSIONS
  //{ path: 'permissions/detail/:id', component: PermissionListComponent },
  { path: 'permissions', component: PermissionListComponent },
  { path: 'permissions/create', component: PermissionCreateComponent },
  { path: 'permissions/edit/:id', component: PermissionEditComponent },
  { path: 'assign/permissions-to-role', component: AssignPermissionsToRoleComponent },
  { path: 'assign/permissions-to-user', component: AssignPermissionsToUserComponent },

  //ROLES
  { path: 'roles/edit/:id', component: RoleEditComponent },
  { path: 'roles', component: RoleListComponent },
  { path: 'roles-with-permissions', component: ListRoleWithPermissionsComponent },
  { path: 'roles/create', component: RoleCreateComponent },

  //--------------REPORTES-------------------
  //SALES
  //{ path: 'sale-report/detail/:id', component: TransferDetailComponent },
  { path: 'sales-report', component: SaleReportComponent },
  //{ path: 'transfers/create', component: TransferCreateComponent },

  //---------------DASHBOARD
  { path: 'dashboard', component: DashboardComponent },
  { path: 'roles-with-permissions', component: ListRoleWithPermissionsComponent },
  { path: 'roles/create', component: RoleCreateComponent },

  //---------------HOME
  { path: 'home', component: HomeComponent },
  { path: 'roles-with-permissions', component: ListRoleWithPermissionsComponent },
  { path: 'roles/create', component: RoleCreateComponent },
];
