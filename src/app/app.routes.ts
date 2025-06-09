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
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';
import { permissionGuard } from './auth/permission.guard';
import { InventoryReportComponent } from './components/reports/inventory-report/inventory-report.component';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog-accessories', pathMatch: 'full' },

  // Login / Registro (públicos)
  { path: 'login', component: LoginComponent },
  { path: 'users/edit/:id', component: UserEditComponent},

  // Públicas
  { path: 'catalog-accessories', component: CatalogComponent },
  { path: 'cart', component: CartComponent },
  { path: 'home', component: HomeComponent },

  //ojo redirecciona a Catalog
  { path: 'sales/create', component: CatalogComponent,
        //canActivate: [permissionGuard]
  },
  {
        path: 'users/create',
        component: UserCreateComponent,
        /* canActivate: [permissionGuard],
        data: { permissions: ['CREAR_USUARIO'] } */
      },

  // Protegidas con authGuard
  {
    path: '',
    canActivate: [authGuard],
    children: [
      // CLIENTES
      {
        path: 'clientes',
        component: ClientListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_CLIENTE'] }
      },
      {
        path: 'clientes/create',
        component: ClientCreateComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['CREAR_CLIENTE'] }
      },
      {
        path: 'clientes/edit/:id',
        component: ClientEditComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['EDITAR_CLIENTE'] }
      },
      {
        path: 'clientes/detail/:id',
        component: ClientDetailComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_CLIENTE'] }
      },

      //SUPPLIERS
      {
        path: 'proveedores',
        component: SupplierListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_PROVEEDOR'] }
      },
      {
        path: 'proveedores/create',
        component: SupplierCreateComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['CREAR_PROVEEDOR'] }
      },
      {
        path: 'proveedores/edit/:id',
        component: SupplierEditComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['EDITAR_PROVEEDOR'] }
      },

      //CATEGORIES
      {
        path: 'categories',
        component: CategoryListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_CATEGORIA'] }
      },
      {
        path: 'categories/create',
        component: CategoryCreateComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['CREAR_CATEGORIA'] }
      },
      {
        path: 'categories/edit/:id',
        component: CategoryEditComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['EDITAR_CATEGORIA'] }
      },
      {
        path: 'categories/detail/:id',
        component: CategoryDetailComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_CATEGORIA'] }
      },


      //WAREHOUSES
      {
        path: 'warehouses',
        component: WarehouseListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_ALMACEN'] }
      },
      {
        path: 'warehouses/create',
        component: WarehouseCreateComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['CREAR_ALMACEN'] }
      },
      {
        path: 'warehouses/edit/:id',
        component: WarehouseEditComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['EDITAR_ALMACEN'] }
      },
      {
        path: 'warehouses/detail/:id',
        component: WarehouseDetailComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_ALMACEN'] }
      },

      //ACCESSORIES
      {
        path: 'accessories',
        component: AccessoryListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_ACCESORIO'] }
      },
      {
        path: 'accessories/create',
        component: AccessoryCreateComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['CREAR_ACCESORIO'] }
      },
      {
        path: 'accessories/edit/:id',
        component: AccessoryEditComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['EDITAR_ACCESORIO'] }
      },
      {
        path: 'accessories/detail/:id',
        component: AccessoryDetailComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_ACCESORIO'] }
      },


      // USERS
      {
        path: 'users',
        component: UserListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_USUARIO'] }
      },
      /* {
        path: 'users/create',
        component: UserCreateComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['CREAR_USUARIO'] }
      }, */
      
      {
        path: 'users/detail/:id',
        component: UserDetailComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_USUARIO'] }
      },


      // PURCHASES
      {
        path: 'purchases',
        component: PurchaseListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_COMPRA'] }
      },
      {
        path: 'purchases/create',
        component: PurchaseCartComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['CREAR_COMPRA'] }
      },
      {
        path: 'purchases/detail/:id',
        component: PurchaseDetailComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_COMPRA'] }
      },

      // SALES
      {
        path: 'sales',
        component: SaleListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_VENTA'] }
      },
      
      {
        path: 'sales/detail/:id',
        component: SaleDetailComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_VENTA'] }
      },
      //ADJUSTMENS
      {
        path: 'adjustments',
        component: AdjustmentListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_AJUSTE'] }
      },
      {
        path: 'adjustments/create',
        component: AdjustmentCreateComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['CREAR_AJUSTE'] }
      },
      {
        path: 'adjustments/detail/:id',
        component: AdjustmentDetailComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_AJUSTE'] }
      },
      //TRANSFERS
      {
        path: 'transfers',
        component: TransferListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_TRASPASO'] }
      },
      {
        path: 'transfers/create',
        component: TransferCreateComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['CREAR_TRASPASO'] }
      },
      {
        path: 'transfers/detail/:id',
        component: TransferDetailComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_TRASPASO'] }
      },


      // PERMISSIONS
      {
        path: 'permissions',
        component: PermissionListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_PERMISO'] }
      },
      {
        path: 'permissions/create',
        component: PermissionCreateComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['CREAR_PERMISO'] }
      },
      {
        path: 'permissions/edit/:id',
        component: PermissionEditComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['EDITAR_PERMISO'] }
      },

      {
        path: 'assign/permissions-to-role',
        component: AssignPermissionsToRoleComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['ASIGNAR_PERMISOS_A_ROL'] }
      },
      {
        path: 'assign/permissions-to-user',
        component: AssignPermissionsToUserComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['ASIGNAR_PERMISOS_A_USER'] }
      },


      // ROLES
      {
        path: 'roles',
        component: RoleListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_ROL'] }
      },
      {
        path: 'roles/create',
        component: RoleCreateComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['CREAR_ROL'] }
      },
      {
        path: 'roles/edit/:id',
        component: RoleEditComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['EDITAR_ROL'] }
      },

      {
        path: 'roles-with-permissions',
        component: ListRoleWithPermissionsComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['VER_ROL'] }
      },

      // REPORTES
      { 
        path: 'sales-report',
        component: SaleReportComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['REPORTE_VENTA'] }
      },
      { 
        path: 'warehouses-report',
        component: InventoryReportComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['REPORTE_ALMACEN'] }
      },

      // DASHBOARD
      { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['DASHBOARD'] }
        
      },

     
    ]
  }
];
