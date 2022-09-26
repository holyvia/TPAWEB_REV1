import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {CurrentThemeProvider} from './lib/themeContext'
import { CurrentUserProvider } from './lib/userContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <CurrentThemeProvider>
    <CurrentUserProvider>
      <App />
    </CurrentUserProvider>
  </CurrentThemeProvider>
)
