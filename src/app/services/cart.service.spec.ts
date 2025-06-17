import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';
import { AccessoryCatalog } from '../models/accessory-catalog.model';

describe('CartService', () => {
  let service: CartService;

  const mockAccessory: AccessoryCatalog = {
  id: 1,
  name: 'Cable HDMI',
  price: 50,
  description: 'Cable HDMI de 2 metros',
  available: true,
  stock: 20,
  categoryId: 1,
  categoryName: 'Cables'
};

  beforeEach(() => {
    localStorage.clear(); // limpia para pruebas
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add item to cart', () => {
    service.addToCart(mockAccessory, 2);
    const items = service.getCartItems();
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(2);
  });

  it('should update quantity if item already exists', () => {
    service.addToCart(mockAccessory, 1);
    service.addToCart(mockAccessory, 2);
    const items = service.getCartItems();
    expect(items[0].quantity).toBe(3);
  });

  it('should remove item from cart', () => {
    service.addToCart(mockAccessory, 1);
    service.removeFromCart(mockAccessory.id);
    const items = service.getCartItems();
    expect(items.length).toBe(0);
  });

  it('should calculate total amount', () => {
    service.addToCart(mockAccessory, 3); // 3 * 50 = 150
    expect(service.getTotalAmount()).toBe(150);
  });

  it('should clear the cart', () => {
    service.addToCart(mockAccessory, 1);
    service.clearCart();
    expect(service.getCartItems().length).toBe(0);
  });
});
