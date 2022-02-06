import './Sidebar.scss';
import { createElement } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as TwentyFourHourIcon } from 'assets/icons/24Hour-Icon.svg';
import { ReactComponent as RocketIcon } from 'assets/icons/Rocket-Icon.svg';
import { useState } from 'react';
import ThemeService from 'services/ThemeService';

const links = [
  {
    route: '/word-of-the-day',
    icon: TwentyFourHourIcon,
    label: 'Word of the Day'
  },
  {
    route: '/word-rush',
    icon: RocketIcon,
    label: 'Word Rush'
  }
];

export default function Sidebar() {
  const [theme, setTheme] = useState(ThemeService.getTheme());
  const toggleTheme = () => {
    setTheme(ThemeService.toggleTheme());
  };

  return (
    <div className='sidebar'>
      <div className='sidebar__links'>
        {links.map(link => (
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
        <button
          className={`toggle__switch ${theme === 'dark' ? 'on' : 'off'}`}
          onClick={toggleTheme}
        >
          <div className='switch__knob' />
        </button>
      </div>
    </div>
  );
}
