import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { SaleService } from '../../services/sale.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockSaleService: jasmine.SpyObj<SaleService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['getCart', 'removeFromCart', 'updateQuantity', 'getCartItems', 'clearCart']);
    mockSaleService = jasmine.createSpyObj('SaleService', ['createSale']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserId', 'isLoggedIn']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    //Importante: preparar valores mock *antes* de crear el componente
    mockAuthService.getUserId.and.returnValue(1);
    mockCartService.getCart.and.returnValue(of([
      { accessory: { id: 1, name: 'Accesorio 1', price: 100, stock: 10, description: 'Descripción 1', available: true }, quantity: 2 },
      { accessory: { id: 2, name: 'Accesorio 2', price: 200, stock: 5, description: 'Descripción 2', available: true }, quantity: 1 }
    ]));

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: SaleService, useValue: mockSaleService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  //calcula el total delos items
  it('should calculate totalItems and totalAmount on init', () => {
    fixture.detectChanges();

    expect(component.userId).toBe(1);
    expect(component.totalItems).toBe(3); // 2 + 1
    expect(component.totalAmount).toBe(400); // (2 * 100) + (1 * 200)
  });

  //eliminar item del carrito
  it('should not call removeFromCart if user cancels the confirmation', fakeAsync(() => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));

    component.removeItem(1);

    tick();

    expect(mockCartService.removeFromCart).not.toHaveBeenCalled();
  }));
  //para cambiar cantidad valida
  it('should call updateQuantity with correct values when quantity is valid', () => {
    const accessoryId = 1;
    const mockEvent = { target: { value: '3' } }; // nueva cantidad válida como string

    component.changeQuantity(accessoryId, mockEvent);

    expect(mockCartService.updateQuantity).toHaveBeenCalledWith(accessoryId, 3);
  });
  //para cambiar cantidad invalida

  it('should NOT call updateQuantity if quantity is negative', () => {
    const accessoryId = 1;
    const mockEvent = { target: { value: '-2' } }; // cantidad inválida

    component.changeQuantity(accessoryId, mockEvent);

    expect(mockCartService.updateQuantity).not.toHaveBeenCalled();
  });

  //simula venta exitosa
  it('should process sale and clear cart on success', fakeAsync(() => {
    // Muestra los métodos de Swal como spies
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    const cartItems = [
      { accessory: { id: 1 }, quantity: 2 },
      { accessory: { id: 2 }, quantity: 1 }
    ];

    // Mock para createSale que emite next inmediatamente
    mockSaleService.createSale.and.returnValue(of({}));

    // Acceso al método privado usando cast any
    (component as any).procesarVenta(cartItems);

    tick();

    expect(mockSaleService.createSale).toHaveBeenCalledWith({
      userId: component.userId,
      saleDetails: [
        { accessoryId: 1, quantity: 2 },
        { accessoryId: 2, quantity: 1 }
      ]
    });

    expect(mockCartService.clearCart).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success' }));
  }));

  //cuando la venta falla
  it('should show error alert on sale creation failure', fakeAsync(() => {
  spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));

  const cartItems = [
    { accessory: { id: 1 }, quantity: 2 }
  ];

  // Mock para createSale que emite error
  mockSaleService.createSale.and.returnValue(throwError(() => new Error('Error al crear venta')));

  (component as any).procesarVenta(cartItems);

  tick();

  expect(mockSaleService.createSale).toHaveBeenCalled();
  expect(mockCartService.clearCart).not.toHaveBeenCalled();
  expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error' }));
}));




});

