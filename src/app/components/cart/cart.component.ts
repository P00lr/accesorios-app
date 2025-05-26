import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { CreateSaleDetail } from '../../models/create-sale-detail.model';
import { CreateSale } from '../../models/create-sale.model';
import { SaleService } from '../../services/sale.service';
import { CartItem } from '../../models/cart-items.model';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  totalAmount: number = 0;
  totalItems: number = 0;

  // Aquí define clientId y userId (puedes cambiar los valores estáticos por inputs o autenticación)
  clientId: number = 2;
  userId: number = 17;

  constructor(private cartService: CartService, private saleService: SaleService) {
    this.cartItems$ = this.cartService.getCart();
  }

  ngOnInit(): void {
    this.cartItems$.subscribe(cart => {
      this.totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
      this.totalAmount = cart.reduce((acc, item) => acc + item.quantity * item.accessory.price, 0);
    });
  }

  removeItem(accessoryId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este accesorio será eliminado del carrito.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(accessoryId);
        Swal.fire({
          title: 'Eliminado',
          text: 'El accesorio ha sido eliminado del carrito.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  changeQuantity(accessoryId: number, event: any): void {
    const newQuantity = Number(event.target.value);
    if (newQuantity >= 0) {
      this.cartService.updateQuantity(accessoryId, newQuantity);
    }
  }

  onSubmit(): void {
    const cartItems = this.cartService.getCartItems();

    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Carrito vacío',
        text: 'No hay productos en el carrito para realizar la compra.'
      });
      return;
    }

    const itemsConProblema = cartItems.filter(item => item.quantity > item.accessory.stock);

    if (itemsConProblema.length > 0) {
      const mensaje = itemsConProblema.map(item =>
        `• ${item.accessory.name}: solo hay ${item.accessory.stock} disponibles, solicitaste ${item.quantity}`
      ).join('<br>');

      Swal.fire({
        icon: 'warning',
        title: 'Stock insuficiente',
        html: `${mensaje}<br><br>¿Deseas continuar con la compra de lo disponible?`,
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          // Ajustar automáticamente las cantidades
          itemsConProblema.forEach(item => {
            item.quantity = item.accessory.stock;
          });

          this.procesarVenta(cartItems);
        }
      });

      return;
    }

    this.procesarVenta(cartItems);
  }

  private procesarVenta(cartItems: any[]): void {
    const saleDetails: CreateSaleDetail[] = cartItems.map(item => ({
      accessoryId: item.accessory.id,
      quantity: item.quantity
    }));

    const sale: CreateSale = {
      clientId: this.clientId,
      userId: this.userId,
      saleDetails: saleDetails
    };

    this.saleService.createSale(sale).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Venta registrada!',
          text: 'La venta se ha creado correctamente.',
          showConfirmButton: false,
          timer: 1500
        });
        this.cartService.clearCart();
      },
      error: err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al registrar la venta.'
        });
      }
    });
  }


}
