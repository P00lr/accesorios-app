import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  totalItems: number = 0;
  animateCart: boolean = false;
  username: string | null = null;
  isLoggedIn: boolean = false;

  isDarkMode: boolean = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Cargar estado del tema guardado o default
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();

    // Suscripción a estado de login y usuario
    this.authService.isLoggedIn$.subscribe(isLogged => {
      this.isLoggedIn = isLogged;
      this.username = isLogged ? this.authService.getUsername() : null;
    });

    // Suscripción a carrito
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
    setTimeout(() => (this.animateCart = false), 500);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('theme-dark');
      // Remueve otros temas si tienes más definidos
      document.body.classList.remove('theme-kids', 'theme-teens', 'theme-adults');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('theme-dark');
      // Vuelve al tema default (por ejemplo 'theme-adults')
      document.body.classList.add('theme-adults');
      localStorage.setItem('theme', 'adults');
    }
  }

  changeTheme(theme: 'kids' | 'teens' | 'adults' | 'dark'): void {
    this.themeService.setTheme(theme);
  }
}




