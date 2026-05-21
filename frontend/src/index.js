import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './App.css';


// FIX ELFSIGHT / RESIZE OBSERVER ERROR

const debounce = (fn, delay) => {

  let timeoutId;

  return (...args) => {

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {

      fn.apply(null, args);

    }, delay);

  };

};

window.addEventListener(
  'error',

  debounce((e) => {

    if (
      e.message ===
      'ResizeObserver loop completed with undelivered notifications.'
    ) {

      const overlay =
        document.getElementById(
          'webpack-dev-server-client-overlay'
        );

      const overlayDiv =
        document.getElementById(
          'webpack-dev-server-client-overlay-div'
        );

      if (overlay) {

        overlay.style.display = 'none';

      }

      if (overlayDiv) {

        overlayDiv.style.display = 'none';

      }

    }

  }, 500)
);


// REACT ROOT

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(

  <React.StrictMode>

    <BrowserRouter>

      <App />

    </BrowserRouter>

  </React.StrictMode>

);