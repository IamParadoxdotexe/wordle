import './Sidebar.scss';
import React, { createElement } from 'react';
import { NavLink } from 'react-router-dom';
import ThemeService from 'services/ThemeService';
import { GameRoutes } from '../globals';
import ToggleSwitch from './ToggleSwitch';
import { Theme } from '../types';

interface State {
  theme: string;
}

export default class Sidebar extends React.Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = {
      theme: ThemeService.getTheme()
    };
    this.toggleTheme = this.toggleTheme.bind(this);
  }

  toggleTheme = (toggled: boolean) => {
    ThemeService.setTheme(toggled ? Theme.DARK : Theme.LIGHT);
  };

  render() {
    return (
      <div className='sidebar'>
        <div className='sidebar__top'>
          <div className='sidebar__title'>WORDLE</div>
          {GameRoutes.map(link => (
            <NavLink
              key={link.route}
              className={({ isActive }) => (isActive ? 'active' : 'inactive')}
              to={link.route}
            >
              <button type='button' tabIndex={-1}>
                {createElement(link.icon)} {link.label}
              </button>
            </NavLink>
          ))}
        </div>
        <div className='sidebar__toggle'>
          Dark Mode
          <ToggleSwitch startToggled={this.state.theme === 'dark'} onToggle={this.toggleTheme} />
        </div>
      </div>
    );
  }
}
