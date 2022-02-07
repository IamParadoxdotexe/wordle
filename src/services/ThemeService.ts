import Cookies from 'universal-cookie';
import { Theme } from '../types';

export default new (class ThemeService {
  private cookies = new Cookies();
  private theme = this.cookies.get('color-theme') as Theme;

  constructor() {
    if (!this.theme) {
      this.setTheme(Theme.DARK);
    }
    ThemeService.replaceBodyTheme(this.theme);
  }

  public getTheme(): string {
    return this.theme;
  }

  public setTheme(newTheme: Theme): void {
    this.theme = newTheme;
    ThemeService.replaceBodyTheme(newTheme);
    this.cookies.set('color-theme', newTheme, { maxAge: 315600000 });
  }

  private static replaceBodyTheme(theme: Theme) {
    document.body.className = document.body.className.replace(/light|dark/, theme);
  }
})();
