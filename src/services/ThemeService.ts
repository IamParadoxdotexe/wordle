import Cookies from 'universal-cookie';
import { Theme } from '../types';

export default new (class ThemeService {
  private cookies = new Cookies();
  private theme = this.cookies.get('color-theme') as Theme;

  constructor() {
    if (!this.theme) {
      const preferLight =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      this.theme = preferLight ? Theme.LIGHT : Theme.DARK;
      this.cookies.set('color-theme', this.theme);
    }

    document.body.className += this.theme;

    // add listener for preference updates
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', event => {
      const newTheme = event.matches ? Theme.LIGHT : Theme.DARK;
      this.setTheme(newTheme);
    });
  }

  public getTheme(): string {
    return this.theme;
  }

  public setTheme(newTheme: Theme): void {
    document.body.className = document.body.className.replace(this.theme, newTheme);
    this.theme = newTheme;
    this.cookies.set('color-theme', newTheme);
  }

  public toggleTheme(): string {
    const newTheme = this.theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    this.setTheme(this.theme === Theme.DARK ? Theme.LIGHT : Theme.DARK);
    return newTheme;
  }
})();
