/**
 * 环境变量配置助手
 * 帮助用户配置合约地址
 */

/**
 * 从 localStorage 获取合约地址
 */
export function getContractAddressFromStorage(): string | null {
  return localStorage.getItem('nft_contract_address')
}

/**
 * 生成 .env.local 文件内容
 */
export function generateEnvLocalContent(contractAddress: string): string {
  return `# NFT 合约地址配置
# 自动生成于 ${new Date().toLocaleString()}
VITE_NFT_CONTRACT_ADDRESS=${contractAddress}

# Pinata 配置（如果需要，从 .env 文件复制）
# VITE_PINATA_JWT=your_jwt_token_here
`
}

/**
 * 下载 .env.local 文件内容
 */
export function downloadEnvLocalFile(contractAddress: string) {
  const content = generateEnvLocalContent(contractAddress)
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '.env.local'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 复制环境变量配置到剪贴板
 */
export async function copyEnvConfigToClipboard(contractAddress: string): Promise<boolean> {
  const content = `VITE_NFT_CONTRACT_ADDRESS=${contractAddress}`
  try {
    await navigator.clipboard.writeText(content)
    return true
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

