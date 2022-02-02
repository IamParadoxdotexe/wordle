import './Sidebar.scss';
import { NavLink } from 'react-router-dom';
import { ReactComponent as TimeIcon } from 'assets/icons/24-hour-icon.svg';

export default function Sidebar() {
  return (
    <div className='sidebar'>
      <NavLink
        className={({ isActive }) => (isActive ? 'active' : 'inactive')}
        to='/word-of-the-day'
      >
        <button type='button'>
          <TimeIcon />
          Word of the Day
        </button>
      </NavLink>
    </div>
  );
}
