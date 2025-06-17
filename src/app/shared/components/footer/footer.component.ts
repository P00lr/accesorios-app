import { Component, OnInit } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  showSidebar$!: Observable<boolean>;
  viewCount: number = 0;
  currentPage: 'home' | 'catalog-accessories' | 'cart' | '' = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.showSidebar$ = this.authService.shouldShowSidebar$();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentPath = this.router.url.split('?')[0];
      const page = this.getPageIdentifier(currentPath);

      if (page) {
        this.currentPage = page;
        this.registerView(page);
        this.getViewCount(page);
      }
    });
  }

  private getPageIdentifier(path: string): 'home' | 'catalog-accessories' | 'cart' | '' {
    switch (path) {
      case '/home': return 'home';
      case '/catalog-accessories': return 'catalog-accessories';
      case '/cart': return 'cart';
      default: return '';
    }
  }

  private registerView(page: 'home' | 'catalog-accessories' | 'cart'): void {
    //console.log('🔼 Enviando vista al backend:', page);
    this.http.post(`https://backend-api-gestion-accesorios.onrender.com/api/views/${page}`, {})
      .subscribe({
        //next: () => console.log('✅ Vista registrada correctamente'),
        error: err => console.error('❌ Error al registrar vista:', err)
      });
  }

  private getViewCount(page: 'home' | 'catalog-accessories' | 'cart'): void {
    //console.log('📥 Obteniendo cantidad de vistas de:', page);
    this.http.get<number>(`https://backend-api-gestion-accesorios.onrender.com/api/views/${page}`)
      .subscribe({
        next: count => {
          //console.log('👁️ Total vistas recibidas:', count);
          this.viewCount = count;
        },
        error: err => console.error('❌ Error al obtener vistas:', err)
      });
  }

}

