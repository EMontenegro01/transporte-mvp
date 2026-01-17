import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import FlotaPage from './pages/FlotaPage'
import MantenimientoPage from './pages/MantenimientoPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col transition-colors">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<FlotaPage />} />
            <Route path="/mantenimiento" element={<MantenimientoPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App