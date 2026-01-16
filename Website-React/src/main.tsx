//React应用的入口文件，负责将React应用挂载到页面上
//index.html中的<script>标签会加载此文件
//负责初始化并渲染整个React应用
import { StrictMode } from 'react'
//开发模式下的额外检查
import { createRoot } from 'react-dom/client'
//创建React应用的根节点
import { BrowserRouter } from 'react-router-dom'
//导入路由组件
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { config } from './config/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import './index.css'
//导入全局样式
import App from './App.tsx'
//导入APP组件

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
