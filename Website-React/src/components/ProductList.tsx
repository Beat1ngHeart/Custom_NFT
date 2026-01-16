import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount, usePublicClient } from 'wagmi'
import { formatTokenURI, CONTRACT_ADDRESS, NFT_ABI, isValidContractAddress, type Address } from '../utils/contract'
import { addNFTToWallet, checkNetwork, switchNetwork } from '../utils/wallet'
import './ProductList.css'

// 定义商品数据类型
interface Product {
  id: string
  image: string
  ipfsCid?: string
  metadataCid?: string
  metadataUrl?: string
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

  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: hash || undefined,
  })
  const [mintedTokenIds, setMintedTokenIds] = useState<Record<string, string>>({}) // 存储已铸造的 Token ID

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
  const [mintingProductId, setMintingProductId] = useState<string | null>(null)

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

  // 铸造 NFT
  const handleMintNFT = async (product: Product) => {
    if (!isConnected) {
      alert('请先连接钱包')
      return
    }

    if (!product.metadataCid) {
      alert('该商品没有 metadata CID，无法铸造 NFT')
      return
    }

    if (!isValidContractAddress(CONTRACT_ADDRESS)) {
      alert('合约地址未配置或无效。请在 .env.local 中设置 VITE_NFT_CONTRACT_ADDRESS')
      return
    }

    if (!window.confirm(`确认铸造 NFT？\nMetadata CID: ${product.metadataCid}`)) {
      return
    }

    try {
      setMintingProductId(product.id)
      const tokenURI = formatTokenURI(product.metadataCid)
      
      if (!CONTRACT_ADDRESS) {
        throw new Error('合约地址未配置')
      }
      
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'mint',
        args: [tokenURI],
      })
    } catch (error: any) {
      console.error('铸造失败:', error)
      alert(`铸造失败: ${error.message || '未知错误'}`)
      setMintingProductId(null)
    }
  }

  // 监听交易状态，铸造成功后获取 Token ID
  useEffect(() => {
    const getTokenId = async () => {
      if (isConfirmed && mintingProductId && hash && publicClient && CONTRACT_ADDRESS) {
        try {
          // 从交易收据中获取 Token ID
          const receipt = await publicClient.getTransactionReceipt({ hash })
          
          // 查找 Transfer 事件来获取 Token ID
          // ERC721 的 Transfer 事件：Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
          const transferEvent = receipt.logs.find((log: any) => {
            // 检查是否是 Transfer 事件（topic[0] 是事件签名）
            return log.topics && log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
          })
          
          if (transferEvent && transferEvent.topics[3]) {
            const tokenId = BigInt(transferEvent.topics[3]).toString()
            setMintedTokenIds(prev => ({ ...prev, [mintingProductId]: tokenId }))
            alert(`✅ NFT 铸造成功！\nToken ID: ${tokenId}\n\n点击"添加到钱包"按钮将 NFT 添加到你的钱包`)
          } else {
            alert('✅ NFT 铸造成功！\n\n注意：无法自动获取 Token ID，请手动查看交易详情')
          }
        } catch (error) {
          console.error('获取 Token ID 失败:', error)
          alert('✅ NFT 铸造成功！\n\n注意：无法自动获取 Token ID，请手动查看交易详情')
        }
        setMintingProductId(null)
      }
    }
    
    getTokenId()
    
    if (error && mintingProductId) {
      alert(`❌ 铸造失败: ${error.message}`)
      setMintingProductId(null)
    }
  }, [isConfirmed, error, mintingProductId, hash, publicClient])

  // 添加 NFT 到钱包
  const handleAddToWallet = async (product: Product) => {
    if (!isValidContractAddress(CONTRACT_ADDRESS)) {
      alert('合约地址未配置，无法添加 NFT 到钱包')
      return
    }

    const tokenId = mintedTokenIds[product.id]
    if (!tokenId) {
      alert('该 NFT 尚未铸造，请先铸造 NFT')
      return
    }

    try {
      // 检查网络（Tenderly 测试网 Chain ID: 623352640）
      const isCorrectNetwork = await checkNetwork(623352640)
      if (!isCorrectNetwork) {
        const shouldSwitch = window.confirm(
          '当前网络不匹配。\n\n合约部署在 Tenderly 测试网 (Chain ID: 623352640)\n\n是否切换到正确的网络？'
        )
        if (shouldSwitch) {
          await switchNetwork(623352640, 'Tenderly Testnet')
        } else {
          return
        }
      }

      await addNFTToWallet({
        contractAddress: CONTRACT_ADDRESS,
        tokenId: tokenId,
        tokenURI: product.metadataUrl,
      })
      
      alert('✅ NFT 已成功添加到钱包！')
    } catch (error: any) {
      console.error('添加 NFT 到钱包失败:', error)
      alert(`❌ 添加失败: ${error.message || '未知错误'}\n\n提示：\n1. 确保钱包已连接\n2. 确保网络正确（Tenderly 测试网）\n3. 确保 NFT 已成功铸造`)
    }
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
                {product.metadataCid && (
                  <p className="metadata-info">✅ Metadata: {product.metadataCid.substring(0, 10)}...</p>
                )}
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
                  {product.metadataCid && (
                    <button
                      onClick={() => handleMintNFT(product)}
                      className="mint-button"
                      disabled={!isConnected || isPending || isConfirming || mintingProductId === product.id}
                    >
                  {mintingProductId === product.id
                    ? isConfirming
                      ? '确认中...'
                      : isPending
                      ? '等待确认...'
                      : '铸造中...'
                    : '铸造 NFT'}
                </button>
              )}
              {mintedTokenIds[product.id] && (
                <button
                  onClick={() => handleAddToWallet(product)}
                  className="add-to-wallet-button"
                  disabled={!isConnected || !isValidContractAddress(CONTRACT_ADDRESS)}
                >
                  💼 添加到钱包
                </button>
              )}
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
              {selectedProduct.ipfsCid && (
                <p><strong>图片 CID：</strong>{selectedProduct.ipfsCid}</p>
              )}
              {selectedProduct.metadataCid && (
                <>
                  <p><strong>Metadata CID：</strong>{selectedProduct.metadataCid}</p>
                  {selectedProduct.metadataUrl && (
                    <p>
                      <strong>Metadata URL：</strong>
                      <a href={selectedProduct.metadataUrl} target="_blank" rel="noopener noreferrer">
                        {selectedProduct.metadataUrl}
                      </a>
                    </p>
                  )}
                </>
              )}
            </div>
            {selectedProduct.metadataCid && (
              <div className="mint-section">
                <button
                  onClick={() => handleMintNFT(selectedProduct)}
                  className="mint-button detail-mint-button"
                  disabled={!isConnected || isPending || isConfirming || mintingProductId === selectedProduct.id}
                >
                  {mintingProductId === selectedProduct.id
                    ? isConfirming
                      ? '确认中...'
                      : isPending
                      ? '等待确认...'
                      : '铸造中...'
                    : '铸造 NFT'}
                </button>
                {!isConnected && (
                  <p className="mint-hint">请先连接钱包才能铸造 NFT</p>
                )}
                {mintedTokenIds[selectedProduct.id] && (
                  <div className="add-to-wallet-section">
                    <p className="token-id-info">
                      ✅ Token ID: {mintedTokenIds[selectedProduct.id]}
                    </p>
                    <button
                      onClick={() => handleAddToWallet(selectedProduct)}
                      className="add-to-wallet-button detail-button"
                      disabled={!isConnected || !isValidContractAddress(CONTRACT_ADDRESS)}
                    >
                      💼 添加到钱包
                    </button>
                    <p className="wallet-hint">
                      💡 提示：添加到钱包后，你可以在 MetaMask 的 NFT 标签页中查看你的 NFT
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductList

