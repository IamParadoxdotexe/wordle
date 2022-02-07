import './App.scss';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import React from 'react';

export default class App extends React.Component<{}, {}> {
  render() {
    return (
      <div id='App'>
        <Sidebar />
        <div className='outlet__container'>
          <div className='outlet'>
            <Outlet />
          </div>
        </div>
      </div>
    );
  }
}
