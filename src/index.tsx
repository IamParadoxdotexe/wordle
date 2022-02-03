import { render } from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WordOfTheDay from './routes/word-of-the-day';
import WordRush from './routes/word-rush';

render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='word-of-the-day' element={<WordOfTheDay />} />
        <Route path='word-rush' element={<WordRush />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
