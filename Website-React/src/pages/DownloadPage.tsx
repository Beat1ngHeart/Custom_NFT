import { useState, useEffect } from 'react'
import { useAccount, usePublicClient, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, NFT_ABI, isValidContractAddress, type Address } from '../utils/contract'
import { formatEther } from 'viem'
import './DownloadPage.css'

interface OwnedNFT {
  tokenId: string
  tokenURI: string
  imageUrl: string
  metadata: any
}

function DownloadPage() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取总供应量
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: isValidContractAddress(CONTRACT_ADDRESS) && isConnected,
    },
  })

  // 检查用户是否拥有某个 Token ID
  const checkOwnership = async (tokenId: bigint): Promise<boolean> => {
    if (!address || !CONTRACT_ADDRESS) return false
    
    try {
      const owner = await publicClient?.readContract({
        address: CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'ownerOf',
        args: [tokenId],
      })
      return owner?.toLowerCase() === address.toLowerCase()
    } catch (error) {
      console.error('检查所有权失败:', error)
      return false
    }
  }

  // 获取 Token URI
  const getTokenURI = async (tokenId: bigint): Promise<string | null> => {
    if (!CONTRACT_ADDRESS) return null
    
    try {
      const uri = await publicClient?.readContract({
        address: CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'tokenURI',
        args: [tokenId],
      })
      return uri as string | null
    } catch (error) {
      console.error('获取 Token URI 失败:', error)
      return null
    }
  }

  // 从 IPFS 获取 metadata
  const fetchMetadata = async (uri: string): Promise<any> => {
    try {
      // 处理不同的 URI 格式
      let url = uri
      if (uri.startsWith('ipfs://')) {
        const cid = uri.replace('ipfs://', '')
        url = `https://gateway.pinata.cloud/ipfs/${cid}`
      } else if (uri.startsWith('http')) {
        url = uri
      } else {
        // 假设是 CID
        url = `https://gateway.pinata.cloud/ipfs/${uri}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('获取 metadata 失败:', error)
      throw error
    }
  }

  // 获取图片 URL
  const getImageUrl = (imageUri: string): string => {
    if (imageUri.startsWith('ipfs://')) {
      const cid = imageUri.replace('ipfs://', '')
      return `https://gateway.pinata.cloud/ipfs/${cid}`
    } else if (imageUri.startsWith('http')) {
      return imageUri
    } else {
      return `https://gateway.pinata.cloud/ipfs/${imageUri}`
    }
  }

  // 加载用户拥有的 NFT
  const loadOwnedNFTs = async () => {
    if (!isConnected || !address) {
      setError('请先连接钱包')
      return
    }

    if (!isValidContractAddress(CONTRACT_ADDRESS)) {
      setError('合约地址未配置或无效。请在 .env.local 中设置 VITE_NFT_CONTRACT_ADDRESS')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supply = totalSupply ? Number(totalSupply) : 0
      const nfts: OwnedNFT[] = []

      // 遍历所有 Token ID，检查所有权
      for (let i = 0; i < supply; i++) {
        const tokenId = BigInt(i)
        const isOwner = await checkOwnership(tokenId)
        
        if (isOwner) {
          const tokenURI = await getTokenURI(tokenId)
          if (tokenURI) {
            try {
              const metadata = await fetchMetadata(tokenURI)
              const imageUrl = metadata.image ? getImageUrl(metadata.image) : ''
              
              nfts.push({
                tokenId: tokenId.toString(),
                tokenURI,
                imageUrl,
                metadata,
              })
            } catch (error) {
              console.error(`获取 Token ${i} 的 metadata 失败:`, error)
            }
          }
        }
      }

      setOwnedNFTs(nfts)
      if (nfts.length === 0) {
        setError('你还没有拥有任何 NFT')
      }
    } catch (error: any) {
      console.error('加载 NFT 失败:', error)
      setError(`加载失败: ${error.message || '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  // 下载图片
  const handleDownload = async (nft: OwnedNFT) => {
    if (!nft.imageUrl) {
      alert('该 NFT 没有图片 URL')
      return
    }

    try {
      const response = await fetch(nft.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `NFT-${nft.tokenId}-${nft.metadata?.name || 'image'}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      alert('✅ 图片下载成功！')
    } catch (error: any) {
      console.error('下载失败:', error)
      alert(`下载失败: ${error.message || '未知错误'}`)
    }
  }

  useEffect(() => {
    if (isConnected && address && isValidContractAddress(CONTRACT_ADDRESS)) {
      loadOwnedNFTs()
    }
  }, [isConnected, address, totalSupply])

  return (
    <div className="download-page">
      <h2>我的 NFT 仓库</h2>
      
      {!isConnected ? (
        <div className="error-message">
          <p>⚠️ 请先连接钱包</p>
        </div>
      ) : !isValidContractAddress(CONTRACT_ADDRESS) ? (
        <div className="error-message">
          <p>⚠️ 合约地址未配置或无效。请在 .env.local 中设置 VITE_NFT_CONTRACT_ADDRESS</p>
        </div>
      ) : (
        <>
          <div className="actions-bar">
            <button onClick={loadOwnedNFTs} disabled={loading} className="refresh-button">
              {loading ? '加载中...' : '🔄 刷新'}
            </button>
            {ownedNFTs.length > 0 && (
              <p className="nft-count">共 {ownedNFTs.length} 个 NFT</p>
            )}
          </div>

          {loading && (
            <div className="loading-message">
              <p>正在加载你的 NFT...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && ownedNFTs.length === 0 && (
            <div className="empty-message">
              <p>你还没有拥有任何 NFT</p>
              <p className="hint">购买或铸造 NFT 后，它们会出现在这里</p>
            </div>
          )}

          {!loading && ownedNFTs.length > 0 && (
            <div className="nfts-grid">
              {ownedNFTs.map((nft) => (
                <div key={nft.tokenId} className="nft-card">
                  {nft.imageUrl ? (
                    <img src={nft.imageUrl} alt={nft.metadata?.name || `NFT #${nft.tokenId}`} />
                  ) : (
                    <div className="no-image">暂无图片</div>
                  )}
                  <div className="nft-info">
                    <h3>{nft.metadata?.name || `NFT #${nft.tokenId}`}</h3>
                    {nft.metadata?.description && (
                      <p className="description">{nft.metadata.description}</p>
                    )}
                    <p className="token-id">Token ID: {nft.tokenId}</p>
                    {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
                      <div className="attributes">
                        <h4>属性：</h4>
                        {nft.metadata.attributes.map((attr: any, index: number) => (
                          <div key={index} className="attribute">
                            <span className="trait">{attr.trait_type}:</span>
                            <span className="value">{attr.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => handleDownload(nft)}
                      className="download-button"
                      disabled={!nft.imageUrl}
                    >
                      ⬇️ 下载图片
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DownloadPage

