import { useState, useEffect } from 'react'
import './ProductList.css'

// 定义商品数据类型
interface Product {
  id: string
  image: string
  price: number
  timestamp: number
}

function ProductList() {
  //声明一个状态变量.products，类型是Product数组
  //初始值是空数组[]
  //setProducts是用于更新products状态的函数
  //useState是React提供的钩子函数，用于声明状态变量和更新函数
  //<Product[]>是状态变量的类型，表示products是一个Product数组
  //[]是初始值，表示products初始值为空数组
  const [products, setProducts] = useState<Product[]>([])
  //使用实例：
  //products = []
  //setProducts([...])
  //products = [{id:1,...}]

  // 从 localStorage 读取商品数据
  useEffect(() => {
    const loadProducts = () => {
      const savedProducts = localStorage.getItem('products')
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts))
      } else {
        setProducts([])
      }
    }

    loadProducts()
    
    // 监听 storage 事件，当其他标签页修改数据时同步更新
    window.addEventListener('storage', loadProducts)
    
    // 监听自定义事件，当同标签页内数据变化时更新
    const handleProductsUpdate = () => {
      loadProducts()
    }
    window.addEventListener('productsUpdated', handleProductsUpdate)
    
    // 定期检查 localStorage 变化（作为备用方案）
    const interval = setInterval(loadProducts, 2000)
    
    return () => {
      window.removeEventListener('storage', loadProducts)
      window.removeEventListener('productsUpdated', handleProductsUpdate)
      clearInterval(interval)
    }
  }, [])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // 购买商品
  const handlePurchase = (product: Product) => {
    if (window.confirm(`确认购买此商品？价格：¥${product.price.toFixed(2)}`)) {
      // 从localStorage中删除已购买商品
      // 直接从 localStorage 读取最新数据，避免闭包问题
      const savedProducts = localStorage.getItem('products')
      if (savedProducts) {
        const currentProducts: Product[] = JSON.parse(savedProducts)
        const updatedProducts = currentProducts.filter(p => p.id !== product.id)
        
        // 更新 localStorage
        localStorage.setItem('products', JSON.stringify(updatedProducts))
        
        // 更新状态
        setProducts(updatedProducts)
        
        // 触发自定义事件，通知其他组件更新
        window.dispatchEvent(new Event('productsUpdated'))
        
        alert('购买成功！')
      }
    }
  }

  // 显示商品详情
  const handleShowDetails = (product: Product) => {
    setSelectedProduct(product)
  }

  // 关闭详情弹窗
  const handleCloseDetails = () => {
    setSelectedProduct(null)
  }

  return (
    <div className="product-list-section">
      <h2>商品列表</h2>
      {products.length === 0 ? (
        <p className="empty-message">暂无商品</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt="商品" />
              <div className="product-info">
                <p className="product-price">¥{product.price.toFixed(2)}</p>
                <div className="product-actions">
                  <button
                    onClick={() => handlePurchase(product)}
                    className="purchase-button"
                  >
                    购买
                  </button>
                  <button
                    onClick={() => handleShowDetails(product)}
                    className="details-button"
                  >
                    详情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 商品详情弹窗 */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseDetails}>
              ×
            </button>
            <h3>商品详情</h3>
            <img src={selectedProduct.image} alt="商品详情" className="detail-image" />
            <div className="detail-info">
              <p><strong>价格：</strong>¥{selectedProduct.price.toFixed(2)}</p>
              <p><strong>商品ID：</strong>{selectedProduct.id}</p>
              <p><strong>上架时间：</strong>{new Date(selectedProduct.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductList

