import Cookies from 'universal-cookie';
import { Theme } from '../types';

export default new (class ThemeService {
  private cookies = new Cookies();
  private theme = this.cookies.get('color-theme') as Theme;

  constructor() {
    if (!this.theme) {
      this.setTheme(Theme.DARK);
    }
    this.replaceBodyTheme(this.theme);
  }

  public getTheme(): string {
    return this.theme;
  }

  public setTheme(newTheme: Theme): void {
    this.theme = newTheme;
    this.replaceBodyTheme(newTheme);
    this.cookies.set('color-theme', newTheme);
  }

  public toggleTheme(): string {
    const newTheme = this.theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    this.setTheme(newTheme);
    return newTheme;
  }

  private replaceBodyTheme(theme: Theme) {
    document.body.className = document.body.className.replace(/light|dark/, theme);
  }
})();
