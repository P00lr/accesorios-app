import { Injectable } from '@angular/core';
import { PurchaseItem } from '../models/items-purchase.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseCartService {

  private readonly STORAGE_KEY = 'purchaseCartItems';

  private cartItems: PurchaseItem[] = [];
  private cartSubject = new BehaviorSubject<PurchaseItem[]>([]);

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
    this.cartSubject.next([...this.cartItems]);
  }

  addToCart(item: PurchaseItem) {
    this.cartItems.push(item);
    this.updateCart();
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
    this.updateCart();
  }

  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  getCartItems(): PurchaseItem[] {
    return [...this.cartItems];
  }
}
