import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  totalItems: number = 0;
  animateCart: boolean = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      const total = items.reduce((acc, item) => acc + item.quantity, 0);
      if (total > this.totalItems) {
        this.triggerCartAnimation();
      }
      this.totalItems = total;
    });
  }

  triggerCartAnimation(): void {
    this.animateCart = true;
    setTimeout(() => this.animateCart = false, 500); // Duración de la animación
  }
}
