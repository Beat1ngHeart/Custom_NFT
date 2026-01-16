import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'
import {
  mainnet,
  sepolia,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
} from 'wagmi/chains'

// Tenderly 测试网配置（如果需要）
const tenderlyTestnet = defineChain({
  id: 623352640, // 根据你的 Tenderly 网络 ID 修改
  name: 'Tenderly Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://virtual.sepolia.eu.rpc.tenderly.co/4fb5e0c9-c961-48ae-ba4f-ef058cdc5450'], // 替换为你的 Tenderly Fork ID
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://dashboard.tenderly.co' },
  },
  testnet: true,
})

// 配置 RainbowKit
export const config = getDefaultConfig({
  appName: 'Custom NFT',
  projectId: '965a4c60543fd2de379223bbc6a475c8', // 从 https://cloud.walletconnect.com 获取（免费注册）
  chains: [
    sepolia, // 以太坊测试网
    polygon,
    optimism,
    arbitrum,
    base,
    tenderlyTestnet, // 如果需要，取消注释
  ],
  ssr: false, // Vite 不使用 SSR
})

