import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { CreateSaleDetail } from '../../models/create-sale-detail.model';
import { CreateSale } from '../../models/create-sale.model';
import { SaleService } from '../../services/sale.service';
import { CartItem } from '../../models/cart-items.model';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  isDarkMode = true;

  cartItems$: Observable<CartItem[]>;
  totalAmount: number = 0;
  totalItems: number = 0;
  showQr: boolean = false;
  qrConfirmCallback?: () => void;


  userId!: number;

  constructor(
    private cartService: CartService,
    private saleService: SaleService,
    private authService: AuthService,
    private router: Router


  ) {
    this.cartItems$ = this.cartService.getCart();
  }

  ngOnInit(): void {
    const userIdFromToken = this.authService.getUserId();
    if (userIdFromToken !== null) {
      this.userId = userIdFromToken;
    } else {
      console.warn('⚠️ No se pudo obtener el userId desde el token');
    }
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
    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        icon: 'info',
        title: 'Inicia sesión',
        text: 'Debes registrarte e iniciar sesión para poder completar el pago.',
        confirmButtonText: 'Ir al login'
      }).then(result => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

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
          itemsConProblema.forEach(item => {
            item.quantity = item.accessory.stock;
          });

          this.mostrarQR(() => this.procesarVenta(cartItems));
        }
      });

      return;
    }

    this.mostrarQR(() => this.procesarVenta(cartItems));
  }

  mostrarQR(callback: () => void): void {
    Swal.fire({
      title: 'Escanea el QR para completar el pago',
      html: `<img src="/qr_pago.png" alt="Código QR" style="max-width: 250px; margin-top: 10px;">`,
      confirmButtonText: 'He pagado',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        callback(); // Procesa la venta después del "pago"
      }
    });
  }

  private procesarVenta(cartItems: any[]): void {
    const saleDetails: CreateSaleDetail[] = cartItems.map(item => ({
      accessoryId: item.accessory.id,
      quantity: item.quantity
    }));

    const sale: CreateSale = {
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

  confirmarPago(): void {
    if (this.qrConfirmCallback) {
      this.qrConfirmCallback();
      this.showQr = false;
      this.qrConfirmCallback = undefined;
    }
  }


}
