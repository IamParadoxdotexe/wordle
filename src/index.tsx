import { render } from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WordOfTheDay from './routes/word-of-the-day';
import WordRush from './routes/word-rush';

render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Navigate to='word-of-the-day' replace />} />
        <Route path='word-of-the-day' element={<WordOfTheDay />} />
        <Route path='word-rush' element={<WordRush />} />
        <Route path='*' element={<Navigate to='word-of-the-day' replace />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
