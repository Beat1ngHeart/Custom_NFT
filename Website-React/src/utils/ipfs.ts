// IPFS 上传工具函数
// 使用 web3.storage 或公共 IPFS 网关上传文件

export interface IPFSUploadResult {
  cid: string  // IPFS 内容标识符
  url: string   // IPFS 访问 URL
}

/**
 * 通用 Bearer Token 认证上传函数（内部使用）
 */
async function uploadWithBearerToken(
  file: File,
  apiUrl: string,
  apiToken: string,
  getCid: (data: any) => string,
  getUrl: (cid: string) => string,
  serviceName: string
): Promise<IPFSUploadResult> {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`上传失败: ${response.statusText}`)
    }

    const data = await response.json()
    const cid = getCid(data)
    const url = getUrl(cid)

    return { cid, url }
  } catch (error) {
    console.error(`${serviceName} 上传错误:`, error)
    throw error
  }
}

/**
 * 方法1: 使用 web3.storage 上传到 IPFS
 * 需要 API Token: https://web3.storage/
 */
export async function uploadToWeb3Storage(file: File, apiToken?: string): Promise<IPFSUploadResult> {
  if (!apiToken) {
    throw new Error('需要 Web3.Storage API Token。请访问 https://web3.storage/ 获取')
  }

  return uploadWithBearerToken(
    file,
    'https://api.web3.storage/upload',
    apiToken,
    (data) => data.cid,
    (cid) => `https://${cid}.ipfs.w3s.link`,
    'Web3.Storage'
  )
}

export async function uploadToPinata(
  file: File,
  options: {
    pinataJWT?: string  // JWT Token（推荐）
    pinataKey?: string  // API Key（传统方式）
    pinataSecret?: string  // API Secret（传统方式）
  }
): Promise<IPFSUploadResult> {
  const formData = new FormData()
  formData.append('file', file)

  // 构建请求头
  const headers: Record<string, string> = {}
  
  if (options.pinataJWT) {
    // 使用 JWT Token 认证（推荐方式）
    headers['Authorization'] = `Bearer ${options.pinataJWT}`
  } else if (options.pinataKey && options.pinataSecret) {
    // 使用传统的 API Key + Secret 认证
    headers['pinata_api_key'] = options.pinataKey
    headers['pinata_secret_api_key'] = options.pinataSecret
  } else {
    throw new Error('需要提供 Pinata JWT Token 或 API Key + Secret')
  }

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`上传失败: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    const cid = data.IpfsHash
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`

    return { cid, url }
  } catch (error) {
    console.error('Pinata 上传错误:', error)
    throw error
  }
}

/**
 * 方法3: 使用公共 IPFS 网关（通过 ipfs-http-client）
 * 需要安装: npm install ipfs-http-client
 * 注意：此方法需要额外安装依赖，推荐使用本地 IPFS Desktop
 * 
 * 由于 Vite 会静态分析 import，此函数需要先安装 ipfs-http-client
 * 如果不需要此功能，可以忽略此函数
 */
export async function uploadToPublicIPFS(_file: File): Promise<IPFSUploadResult> {
  // 由于 Vite 的静态分析限制，需要先安装 ipfs-http-client
  // 如果未安装，此函数会抛出错误
  // 推荐使用本地 IPFS Desktop（方法3）
  
  throw new Error(
    '公共 IPFS 上传功能需要安装 ipfs-http-client。\n' +
    '请运行: npm install ipfs-http-client\n' +
    '或者使用本地 IPFS Desktop（推荐，无需安装额外依赖）'
  )
  
  // 如果安装了 ipfs-http-client，取消下面的注释并删除上面的 throw
  /*
  try {
    const { create } = await import('ipfs-http-client')
    
    const ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    })

    const fileBuffer = await file.arrayBuffer()
    const result = await ipfs.add(fileBuffer)
    const cid = result.cid.toString()
    const url = `https://ipfs.io/ipfs/${cid}`

    if (ipfs.stop) {
      await ipfs.stop()
    }

    return { cid, url }
  } catch (error: any) {
    console.error('公共 IPFS 上传错误:', error)
    throw error
  }
  */
}

/**
 * 方法5: 使用 NFT.Storage（专为 NFT 设计）
 * 需要 API Token: https://nft.storage/
 */
export async function uploadToNFTStorage(file: File, apiToken?: string): Promise<IPFSUploadResult> {
  if (!apiToken) {
    throw new Error('需要 NFT.Storage API Token。请访问 https://nft.storage/ 获取')
  }

  return uploadWithBearerToken(
    file,
    'https://api.nft.storage/upload',
    apiToken,
    (data) => data.value.cid,
    (cid) => `https://${cid}.ipfs.nftstorage.link`,
    'NFT.Storage'
  )
}

/**
 * 通用上传函数（推荐使用）
 * 根据配置选择上传方式
 */
export async function uploadImageToIPFS(
  file: File,
  method: 'web3' | 'pinata' | 'nftstorage' | 'public' = 'public',
  credentials?: {
    web3Token?: string
    pinataJWT?: string  // JWT Token（推荐）
    pinataKey?: string  // API Key（传统方式）
    pinataSecret?: string  // API Secret（传统方式）
    nftStorageToken?: string
  }
): Promise<IPFSUploadResult> {
  switch (method) {
    case 'web3':
      if (!credentials?.web3Token) {
        throw new Error('需要 Web3.Storage API Token')
      }
      return uploadToWeb3Storage(file, credentials.web3Token)

    case 'pinata':
      // 优先使用 JWT Token，如果没有则使用 API Key + Secret
      if (credentials?.pinataJWT) {
        return uploadToPinata(file, { pinataJWT: credentials.pinataJWT })
      } else if (credentials?.pinataKey && credentials?.pinataSecret) {
        return uploadToPinata(file, { 
          pinataKey: credentials.pinataKey, 
          pinataSecret: credentials.pinataSecret 
        })
      } else {
        throw new Error('需要提供 Pinata JWT Token 或 API Key + Secret')
      }

    case 'nftstorage':
      if (!credentials?.nftStorageToken) {
        throw new Error('需要 NFT.Storage API Token')
      }
      return uploadToNFTStorage(file, credentials.nftStorageToken)

    case 'public':
    default:
      return uploadToPublicIPFS(file)
  }
}

/**
 * 从 IPFS CID 获取图片 URL
 */
export function getIPFSImageUrl(cid: string, gateway: string = 'ipfs.io'): string {
  return `https://${gateway}/ipfs/${cid}`
}

/**
 * 常用的 IPFS 网关列表
 */
export const IPFS_GATEWAYS = {
  ipfs: 'ipfs.io',
  cloudflare: 'cloudflare-ipfs.com',
  pinata: 'gateway.pinata.cloud',
  infura: 'ipfs.infura.io',
  nftstorage: 'nftstorage.link',
}

