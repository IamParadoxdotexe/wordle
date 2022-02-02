import './App.scss';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      Hello world!
      <Outlet />
    </div>
  );
}

export default App;
