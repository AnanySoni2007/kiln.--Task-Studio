import { createRoot } from 'react-dom/client'
import { StoreProvider } from './store'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StoreProvider>
    <App />
  </StoreProvider>
)
