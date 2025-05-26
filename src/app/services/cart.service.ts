import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AccessoryCatalog } from '../models/accessory-catalog.model';
import { CartItem } from '../models/cart-items.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly STORAGE_KEY = 'cartItems';

  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    const savedCart = localStorage.getItem(this.STORAGE_KEY);
    this.cartItems = savedCart ? JSON.parse(savedCart) : [];
    this.cartSubject.next(this.cartItems);
  }

  getCart() {
    return this.cartSubject.asObservable();
  }

  private updateCart() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems));
    this.cartSubject.next([...this.cartItems]);  // Emite copia para evitar referencias directas
  }

  addToCart(accessory: AccessoryCatalog, quantity: number = 1) {
  const existingItem = this.cartItems.find(item => item.accessory.id === accessory.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.cartItems.push({ accessory, quantity });
  }
  this.updateCart();
}


  removeFromCart(accessoryId: number) {
    this.cartItems = this.cartItems.filter(item => item.accessory.id !== accessoryId);
    this.updateCart();
  }

  updateQuantity(accessoryId: number, newQuantity: number) {
    const item = this.cartItems.find(i => i.accessory.id === accessoryId);
    if (item) {
      if (newQuantity > 0) {
        item.quantity = newQuantity;
      } else {
        this.removeFromCart(accessoryId);
      }
      this.updateCart();
    }
  }

  getTotalItems(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotalAmount(): number {
    return this.cartItems.reduce((acc, item) => acc + item.accessory.price * item.quantity, 0);
  }

  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  // Método agregado para obtener el snapshot actual del carrito
  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }
}

