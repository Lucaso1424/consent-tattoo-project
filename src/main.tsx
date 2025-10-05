import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import FormPdf from './pages/FormPdf/FormPdf.tsx'
import { Provider } from './components/ui/provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App/>}/>
          <Route path='/form' element={<FormPdf/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
