/**
 * 钱包工具函数
 * 用于添加 NFT 到钱包
 */

export interface AddNFTParams {
  contractAddress: string
  tokenId: string | number
  tokenURI?: string
  name?: string
  symbol?: string
}

/**
 * 添加 NFT 到 MetaMask 钱包
 * 使用 EIP-747 watchAsset 标准
 */
export async function addNFTToWallet(params: AddNFTParams): Promise<boolean> {
  const { contractAddress, tokenId, tokenURI, name, symbol } = params

  // 检查是否支持 watchAsset
  if (!window.ethereum || !window.ethereum.request) {
    throw new Error('未检测到钱包，请安装 MetaMask 或其他支持的钱包')
  }

  try {
    // 使用 EIP-747 watchAsset 标准添加 NFT
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC721',
        options: {
          address: contractAddress,
          tokenId: tokenId.toString(),
          // 可选：提供 tokenURI 以便钱包显示 NFT 信息
          ...(tokenURI && { tokenURI }),
        },
      },
    })

    if (wasAdded) {
      console.log('✅ NFT 已成功添加到钱包')
      return true
    } else {
      console.log('❌ 用户拒绝了添加 NFT 请求')
      return false
    }
  } catch (error: any) {
    console.error('添加 NFT 失败:', error)
    throw new Error(error.message || '添加 NFT 失败')
  }
}

/**
 * 检查当前网络是否匹配
 */
export async function checkNetwork(chainId: number): Promise<boolean> {
  if (!window.ethereum) {
    return false
  }

  try {
    const currentChainId = await window.ethereum.request({
      method: 'eth_chainId',
    })

    const currentChainIdNumber = parseInt(currentChainId as string, 16)
    return currentChainIdNumber === chainId
  } catch (error) {
    console.error('检查网络失败:', error)
    return false
  }
}

/**
 * 切换到指定网络
 */
export async function switchNetwork(chainId: number, networkName?: string): Promise<boolean> {
  if (!window.ethereum) {
    throw new Error('未检测到钱包')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    })
    return true
  } catch (switchError: any) {
    // 如果网络不存在，尝试添加网络
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: networkName || `Chain ${chainId}`,
              nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['http://127.0.0.1:8545'], // Anvil 本地 RPC
              blockExplorerUrls: ['http://127.0.0.1:8545'],
            },
          ],
        })
        return true
      } catch (addError) {
        console.error('添加网络失败:', addError)
        throw new Error('无法添加网络')
      }
    }
    throw switchError
  }
}

// 扩展 Window 接口以支持 ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any }) => Promise<any>
      isMetaMask?: boolean
    }
  }
}


