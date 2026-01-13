import { Link } from 'react-router-dom'
//{ Link } 解构导入，只导入Link组件
//Link是React Router提供的导航组件，用于在应用内跳转，不会刷新页面
import Wallet from '../components/wallet'
import './HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <div className="header">
        <h1>交易平台</h1>
        <Wallet />
      </div>
      
      <div className="navigation">
        <Link to="/upload" className="nav-button upload-nav">
          <h2>上传商品</h2>
          <p>上传图片并设置价格</p>
        </Link>
        
        <Link to="/products" className="nav-button products-nav">
          <h2>商品列表</h2>
          <p>浏览和购买商品</p>
        </Link>
      </div>
    </div>
  )
}

export default HomePage


