import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { SearchService } from '../../../services/search.service';
import { BUSINESS_INFO } from '../../../data/business-info';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  totalItems: number = 0;
  animateCart: boolean = false;
  username: string | null = null;
  isLoggedIn: boolean = false;

  userId: number | null = null;


  isDarkMode: boolean = false;
  searchTerm = '';
  searchResults: any[] = [];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private searchService: SearchService,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    // Cargar estado del tema guardado o default
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();

    // Suscripción a estado de login y usuario
    this.authService.isLoggedIn$.subscribe(isLogged => {
      this.isLoggedIn = isLogged;
      if (isLogged) {
        this.username = this.authService.getUsername();
        this.userId = this.authService.getUserId(); // ← aquí obtenemos el id
      } else {
        this.username = null;
        this.userId = null;
      }
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

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();

    if (term === '') {
      this.searchResults = [];
      return;
    }

    this.searchResults = BUSINESS_INFO.filter(item =>
      item.title.toLowerCase().includes(term) ||
      item.content.toLowerCase().includes(term)
    );
  }

  async goToSection(fragment: string) {
  this.searchResults = [];
  this.searchTerm = '';

  await this.router.navigate(['/home'], { fragment });

  setTimeout(() => {
    this.viewportScroller.scrollToAnchor(fragment);

    // Compensar con scroll hacia arriba (ajusta el valor si es necesario)
    window.scrollBy(0, -80); // 80px arriba
  }, 100);
}


  preventSubmit(event: Event) {
    event.preventDefault(); // evita que el form recargue la página
  }

  // Oculta sugerencias si haces clic fuera
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container')) {
      this.searchResults = [];
    }
  }

  // Oculta sugerencias si presionas ESC
  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    this.searchResults = [];
  }
}




