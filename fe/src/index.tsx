import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "swiper/css";
import 'locale/i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

if (process.env.NODE_ENV === 'production') {
  // Tắt các warning React Router Future Flag
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('React Router Future Flag Warning') ||
        args[0].includes('Relative route resolution within Splat routes'))
    ) {
      return;
    }
    originalWarn(...args);
  };

  // Nếu muốn tắt luôn console.log, console.error, console.info, console.debug trên production thì bỏ comment các dòng dưới

  console.log = () => { };
  console.error = () => { };
  console.info = () => { };
  console.debug = () => { };

}

root.render(<App />);

reportWebVitals();
