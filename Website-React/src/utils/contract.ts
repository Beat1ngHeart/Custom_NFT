import type { Abi } from 'viem'
import basicNftABI from '../contract/basicNftABI.json'

// 合约地址类型
export type Address = `0x${string}`

// 合约地址（部署后需要更新）
// 可以从环境变量读取，或让用户输入
const contractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS as string | undefined
export const CONTRACT_ADDRESS = contractAddress ? (contractAddress as Address) : undefined

// 合约 ABI
export const NFT_ABI = basicNftABI as Abi

/**
 * 将 metadata CID 转换为合约需要的 URI 格式
 * 合约的 BASE_URI 是 "https://gateway.pinata.cloud/ipfs/"
 * 所以只需要传入 CID 即可
 */
export function formatTokenURI(metadataCid: string): string {
  // 如果已经是完整 URL，提取 CID
  if (metadataCid.startsWith('http')) {
    const match = metadataCid.match(/ipfs\/([^/?]+)/)
    if (match) {
      return match[1]
    }
  }
  // 如果已经是 ipfs:// 格式，提取 CID
  if (metadataCid.startsWith('ipfs://')) {
    return metadataCid.replace('ipfs://', '')
  }
  // 直接返回 CID
  return metadataCid
}

/**
 * 验证合约地址是否有效
 */
export function isValidContractAddress(address: string | undefined): address is Address {
  if (!address) return false
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

