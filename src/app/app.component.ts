import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    NavbarComponent,
    FooterComponent, 
    SidebarComponent, 
    RouterModule, 
    CommonModule],
})
export class AppComponent implements OnInit {
  
  showSidebar$!: Observable<boolean>;
  isDarkMode = false;



  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    
    this.showSidebar$ = this.authService.shouldShowSidebar$();

    // Inicializar tema
    this.themeService.initTheme();
  }

  changeTheme(theme: 'kids' | 'teens' | 'adults' | 'dark'): void {
    this.themeService.setTheme(theme);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  businessSearchResults: any[] = [];

  onSearchResultsChanged(results: any[]) {
    this.businessSearchResults = results;
  }
}

