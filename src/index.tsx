import React from 'react';
import { render } from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/home';

render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='word-of-the-day' element={<Home />} />
        <Route path='word-rush' element={<Home />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
