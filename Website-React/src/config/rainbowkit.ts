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

// Anvil 本地测试网络配置
const anvilLocal = defineChain({
  id: 31337, // Anvil 默认 Chain ID
  name: 'Anvil Local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'], // Anvil 本地 RPC 端点
    },
  },
  blockExplorers: {
    default: { name: 'Local', url: 'http://127.0.0.1:8545' },
  },
  testnet: true,
})

// 配置 RainbowKit
export const config = getDefaultConfig({
  appName: 'Custom NFT',
  projectId: '965a4c60543fd2de379223bbc6a475c8', // 从 https://cloud.walletconnect.com 获取（免费注册）
  chains: [
    anvilLocal, // Anvil 本地测试网络（默认）
    sepolia, // 以太坊测试网
    polygon,
    optimism,
    arbitrum,
    base,
  ],
  ssr: false, // Vite 不使用 SSR
})

