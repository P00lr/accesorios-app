import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themeKey = 'selectedTheme';

  constructor() {}

  initTheme() {
    const savedTheme = localStorage.getItem(this.themeKey);
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Tema automático según hora (día/noche)
      const hour = new Date().getHours();
      const theme = hour >= 19 || hour < 7 ? 'dark' : 'teens';
      this.setTheme(theme);
    }
  }

  setTheme(theme: string) {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem(this.themeKey, theme);
  }
}
