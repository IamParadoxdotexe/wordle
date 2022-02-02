import './App.scss';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div>
      <Sidebar />
      <div className='outlet__container'>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
