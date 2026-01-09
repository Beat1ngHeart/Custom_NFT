import { useState, useEffect } from 'react'
//useState让函数组件能够存储和更新数据
//在数据变化时重新渲染组件
//记住组件的数据状态
//useEffect让函数组件能够：
//在组件渲染后执行代码
//监听数据变化并执行相应操作
//清理资源（如取消订阅、清除定时器等）
import './ImageUploader.css'

// 定义商品数据类型
interface Product 
{
  id: string
  image: string
  price: number
  timestamp: number
}

function ImageUploader() 
{
  const [image, setImage] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false)
  const [privateKey, setPrivateKey] = useState<string>('')

  // 页面加载时从 localStorage 读取数据
  useEffect(() => {
    const savedProducts = localStorage.getItem('products')
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
    
    const savedWallet = localStorage.getItem('walletAddress')
    if (savedWallet) {
      setWalletAddress(savedWallet)
    }
  }, [])
  //没有依赖数组 = 每次渲染都执行
  //空数组 = 只在组件挂载时执行一次
  //[dep] = 当 dep 变化时执行

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 将图片转换为 base64 字符串
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 保存商品信息
  const handleSave = () => {
    if (!image || !price) {
      alert('请上传图片并输入价格')
      return
    }

    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('请输入有效的价格')
      return
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      image: image,
      price: priceNum,
      timestamp: Date.now()
    }

    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    
    // 保存到 localStorage
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    
    // 触发自定义事件，通知商品列表更新
    window.dispatchEvent(new Event('productsUpdated'))

    // 清空表单
    setImage('')
    setPrice('')
    alert('商品已保存！')
  }

  // 打开钱包弹窗
  const handleOpenWallet = () => {
    setShowWalletModal(true)
  }

  // 关闭钱包弹窗
  const handleCloseWallet = () => {
    setShowWalletModal(false)
    setPrivateKey('')
  }

  // 绑定钱包
  const handleBindWallet = () => {
    if (!privateKey.trim()) {
      alert('请输入私钥')
      return
    }

    // 这里可以添加私钥验证逻辑
    // 简单示例：生成一个钱包地址（实际应用中应该使用加密库）
    const address = '0x' + privateKey.slice(0, 20) + '...' + privateKey.slice(-8)
    
    setWalletAddress(address)
    localStorage.setItem('walletAddress', address)
    localStorage.setItem('privateKey', privateKey) // 注意：实际应用中私钥应该加密存储
    
    alert('钱包绑定成功！')
    handleCloseWallet()
  }

  return (
    <div className="image-uploader">
      <div className="header-section">
        <h2>上传商品</h2>
        <button onClick={handleOpenWallet} className="wallet-button">
          {walletAddress ? `钱包: ${walletAddress}` : '绑定钱包'}
        </button>
      </div>
      
      {/* 上传区域 */}
      <div className="upload-section">
        <div className="image-preview">
          {image ? (
            <img src={image} alt="预览" />
          ) : (
            <div className="placeholder">点击下方按钮选择图片</div>
          )}
        </div>
        
        <label className="upload-button">
          选择图片
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* 价格输入 */}
      <div className="price-section">
        <label>
          价格：
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="请输入价格"
            min="0"
            step="0.01"
          />
        </label>
      </div>

      {/* 保存按钮 */}
      <button onClick={handleSave} className="save-button">
        保存商品
      </button>

      {/* 钱包绑定弹窗 */}
      {showWalletModal && (
        <div className="modal-overlay" onClick={handleCloseWallet}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseWallet}>
              ×
            </button>
            <h3>绑定钱包</h3>
            <div className="wallet-form">
              <label>
                私钥：
                <input
                  type="password"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="请输入私钥"
                  className="wallet-input"
                />
              </label>
              <div className="wallet-actions">
                <button onClick={handleBindWallet} className="bind-button">
                  绑定
                </button>
                <button onClick={handleCloseWallet} className="cancel-button">
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader

