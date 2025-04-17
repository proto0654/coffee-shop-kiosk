import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter } from 'react-router-dom';

// В будущих версиях React Router (v7) следует использовать:
// v7_startTransition и v7_relativeSplatPath
// Текущие предупреждения можно игнорировать до обновления до React Router v7

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
