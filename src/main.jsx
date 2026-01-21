import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

// Auto-expand Telegram Web App
if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();

  // Native App Look
  tg.setHeaderColor('#050505'); // Match --color-background
  tg.setBackgroundColor('#050505');

  // Enable closing confirmation to prevent accidental swipes
  tg.enableClosingConfirmation();
}
