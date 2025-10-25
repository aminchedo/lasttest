import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import DownloadsProvider from './context/DownloadsProvider'
import './styles/rtl.css'
import './styles/animations.css'
import './styles/glassmorphism.css'
import './styles/main.css'
import './index.css'
import './styles/ui-kit.css'

// تنظیم RTL و زبان فارسی
document.documentElement.setAttribute('dir', 'rtl');
document.documentElement.setAttribute('lang', 'fa');

// Register Service Worker for Background Downloads
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DownloadsProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            direction: 'rtl',
            textAlign: 'right',
          },
        }}
      />
    </DownloadsProvider>
  </React.StrictMode>,
)
