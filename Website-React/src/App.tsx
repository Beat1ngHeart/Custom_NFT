import { Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import ProductsPage from './pages/ProductsPage'
import DeployPage from './pages/DeployPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/deploy" element={<DeployPage />} />
    </Routes>
  )
}

export default App
