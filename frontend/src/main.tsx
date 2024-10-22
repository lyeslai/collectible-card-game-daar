import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.module.css';
import App from './App'; // Assurez-vous que App est correctement importé ici

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
