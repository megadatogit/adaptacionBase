import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.jsx'


// Importación de fuentes y pesos específicos
import '@fontsource/inter/400.css' // Normal / Regular
import '@fontsource/inter/500.css' // Medium
import '@fontsource/inter/700.css' // Bold

import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
