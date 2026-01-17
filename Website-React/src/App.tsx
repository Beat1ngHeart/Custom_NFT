import { Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import ProductsPage from './pages/ProductsPage'
import DeployPage from './pages/DeployPage'
import DownloadPage from './pages/DownloadPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/deploy" element={<DeployPage />} />
      <Route path="/download" element={<DownloadPage />} />
    </Routes>
  )
}

export default App
