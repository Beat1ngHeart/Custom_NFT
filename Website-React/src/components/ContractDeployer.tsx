import { useState, useEffect } from 'react'
import { useWaitForTransactionReceipt, useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { CONTRACT_ADDRESS } from '../utils/contract'
import { downloadEnvLocalFile, copyEnvConfigToClipboard } from '../utils/envHelper'
import './ContractDeployer.css'

// 合约 JSON 文件路径（放在 public 目录中）
const CONTRACT_JSON_PATH = '/basic-nft.json'

function ContractDeployer() {
  const { isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const [deployedAddress, setDeployedAddress] = useState<string | null>(
    CONTRACT_ADDRESS || localStorage.getItem('nft_contract_address')
  )
  const [bytecode, setBytecode] = useState<string>('')
  const [isLoadingBytecode, setIsLoadingBytecode] = useState<boolean>(false)
  const [bytecodeError, setBytecodeError] = useState<string | null>(null)
  const [deployHash, setDeployHash] = useState<`0x${string}` | null>(null)
  const [isDeploying, setIsDeploying] = useState<boolean>(false)
  const [deployError, setDeployError] = useState<Error | null>(null)

  const { isLoading: isConfirming, isSuccess: isDeployed, data: receipt } =
    useWaitForTransactionReceipt({
      hash: deployHash || undefined,
    })

  // 自动加载合约字节码
  useEffect(() => {
    const loadBytecode = async () => {
      if (bytecode) return // 如果已经有字节码，不再加载
      
      setIsLoadingBytecode(true)
      setBytecodeError(null)
      
      try {
        const response = await fetch(CONTRACT_JSON_PATH)
        if (!response.ok) {
          throw new Error(`无法加载合约文件: ${response.statusText}`)
        }
        
        const data = await response.json()
        if (!data.bytecode) {
          throw new Error('合约文件中没有 bytecode 字段')
        }
        
        // 确保字节码以 0x 开头
        let bytecodeValue = data.bytecode.trim()
        if (!bytecodeValue.startsWith('0x')) {
          bytecodeValue = '0x' + bytecodeValue
        }
        
        if (bytecodeValue.length < 10) {
          throw new Error('字节码太短，可能无效')
        }
        
        setBytecode(bytecodeValue)
        console.log('✅ 合约字节码已自动加载')
      } catch (error: any) {
        console.error('加载字节码失败:', error)
        setBytecodeError(error.message || '加载失败')
      } finally {
        setIsLoadingBytecode(false)
      }
    }
    
    loadBytecode()
  }, []) // 只在组件挂载时加载一次

  // 部署成功后从交易收据获取合约地址
  useEffect(() => {
    const getContractAddress = async () => {
      if (isDeployed && deployHash && publicClient) {
        try {
          let contractAddress: string | undefined
          
          // 方法1: 从交易收据获取
          if (receipt?.contractAddress) {
            contractAddress = receipt.contractAddress
            console.log('从交易收据获取合约地址:', contractAddress)
          } else {
            // 方法2: 从 publicClient 获取交易收据
            console.log('交易收据中没有合约地址，尝试从 publicClient 获取...')
            const fullReceipt = await publicClient.getTransactionReceipt({ hash: deployHash })
            if (fullReceipt?.contractAddress) {
              contractAddress = fullReceipt.contractAddress
              console.log('从 publicClient 获取合约地址:', contractAddress)
            }
          }
          
          if (contractAddress) {
            setDeployedAddress(contractAddress)
            localStorage.setItem('nft_contract_address', contractAddress)
            console.log('✅ 合约地址已自动获取并保存:', contractAddress)
            alert(`✅ 合约部署成功！\n合约地址: ${contractAddress}\n\n已自动保存到 localStorage，请更新 .env.local 文件中的 VITE_NFT_CONTRACT_ADDRESS=${contractAddress}`)
          } else {
            console.warn('无法从交易收据获取合约地址')
            console.log('交易哈希:', deployHash)
            console.log('交易收据:', receipt)
            alert(`✅ 合约部署成功！\n\n交易哈希: ${deployHash}\n\n请在区块链浏览器查看合约地址，或使用"更新地址"按钮手动输入。`)
          }
        } catch (error) {
          console.error('获取合约地址失败:', error)
          alert(`✅ 合约部署成功！\n\n交易哈希: ${deployHash}\n\n获取合约地址时出错，请在区块链浏览器查看，或使用"更新地址"按钮手动输入。`)
        }
      }
    }
    getContractAddress()
  }, [isDeployed, deployHash, receipt, publicClient])

  const handleDeploy = async () => {
    if (!isConnected) {
      alert('请先连接钱包')
      return
    }

    if (!walletClient) {
      alert('钱包客户端未准备好，请稍后重试')
      return
    }

    if (!bytecode || !bytecode.startsWith('0x')) {
      alert('合约字节码未加载，请刷新页面重试')
      return
    }

    if (!window.confirm('确认部署合约？这将消耗 Gas 费用。')) {
      return
    }

    setIsDeploying(true)
    setDeployError(null)
    setDeployHash(null)

    try {
      // 使用 sendTransaction 发送合约创建交易
      const hash = await walletClient.sendTransaction({
        data: bytecode as `0x${string}`,
      })
      
      setDeployHash(hash)
      console.log('部署交易已发送，哈希:', hash)
    } catch (error: any) {
      console.error('部署失败:', error)
      setDeployError(error)
      alert(`部署失败: ${error.message || '未知错误'}`)
    } finally {
      setIsDeploying(false)
    }
  }

  const handleReloadBytecode = async () => {
    setIsLoadingBytecode(true)
    setBytecodeError(null)
    setBytecode('')
    
    try {
      const response = await fetch(CONTRACT_JSON_PATH)
      if (!response.ok) {
        throw new Error(`无法加载合约文件: ${response.statusText}`)
      }
      
      const data = await response.json()
      if (!data.bytecode) {
        throw new Error('合约文件中没有 bytecode 字段')
      }
      
      // 确保字节码以 0x 开头
      let bytecodeValue = data.bytecode.trim()
      if (!bytecodeValue.startsWith('0x')) {
        bytecodeValue = '0x' + bytecodeValue
      }
      
      if (bytecodeValue.length < 10) {
        throw new Error('字节码太短，可能无效')
      }
      
      setBytecode(bytecodeValue)
      console.log('✅ 合约字节码已重新加载')
    } catch (error: any) {
      console.error('加载字节码失败:', error)
      setBytecodeError(error.message || '加载失败')
    } finally {
      setIsLoadingBytecode(false)
    }
  }

  const handleSaveAddress = () => {
    const savedAddress = localStorage.getItem('nft_contract_address')
    const defaultAddress = savedAddress || deployedAddress || ''
    
    const address = prompt('请输入已部署的合约地址:', defaultAddress)
    if (address && /^0x[a-fA-F0-9]{40}$/.test(address)) {
      setDeployedAddress(address)
      localStorage.setItem('nft_contract_address', address)
      alert(`✅ 合约地址已保存！\n\n地址: ${address}\n\n请更新 .env.local 文件：\nVITE_NFT_CONTRACT_ADDRESS=${address}`)
    } else if (address) {
      alert('❌ 无效的合约地址格式\n\n地址必须是 0x 开头的 42 个字符（0x + 40 个十六进制字符）')
    }
  }
  
  const handleCopyAddress = () => {
    if (deployedAddress) {
      navigator.clipboard.writeText(deployedAddress)
      alert(`✅ 合约地址已复制到剪贴板：\n${deployedAddress}`)
    }
  }

  const handleDownloadEnvFile = () => {
    if (deployedAddress) {
      downloadEnvLocalFile(deployedAddress)
      alert(`✅ .env.local 文件已下载！\n\n请将文件移动到 Website-React/ 目录下，然后重启开发服务器。`)
    }
  }

  const handleCopyEnvConfig = async () => {
    if (deployedAddress) {
      const success = await copyEnvConfigToClipboard(deployedAddress)
      if (success) {
        alert(`✅ 环境变量配置已复制到剪贴板！\n\n${deployedAddress}\n\n请粘贴到 .env.local 文件中。`)
      } else {
        alert('❌ 复制失败，请手动复制地址')
      }
    }
  }

  return (
    <div className="contract-deployer">
      <h2>智能合约部署</h2>

      {!isConnected && (
        <div className="deploy-warning">
          <p>⚠️ 请先连接钱包才能部署合约</p>
        </div>
      )}

      {deployedAddress && (
        <div className="deployed-info">
          <p>✅ 已配置合约地址:</p>
          <div className="contract-address-container">
            <p className="contract-address">{deployedAddress}</p>
            <button onClick={handleCopyAddress} className="copy-address-btn" title="复制地址">
              📋 复制
            </button>
          </div>
          <div className="address-actions">
            <div className="action-buttons">
              <button onClick={handleSaveAddress} className="update-address-btn">
                更新地址
              </button>
              <button onClick={handleCopyEnvConfig} className="copy-env-btn" title="复制环境变量配置">
                📋 复制配置
              </button>
              <button onClick={handleDownloadEnvFile} className="download-env-btn" title="下载 .env.local 文件">
                ⬇️ 下载配置
              </button>
            </div>
            <p className="env-hint">
              💡 提示：复制配置后，请粘贴到 <code>Website-React/.env.local</code> 文件中，然后重启开发服务器
            </p>
          </div>
        </div>
      )}

      <div className="deploy-section">
        <h3>一键部署合约</h3>
        <div className="deploy-explanation">
          <p><strong>📚 部署流程说明：</strong></p>
          <ol>
            <li><strong>字节码</strong>：合约编译后的代码（已自动加载，无需手动输入）</li>
            <li><strong>部署</strong>：将字节码发送到区块链（点击按钮即可）</li>
            <li><strong>合约地址</strong>：部署后由区块链自动生成（会自动获取并保存）</li>
          </ol>
          <p className="deploy-hint">
            ⚠️ 注意：部署合约需要消耗 Gas 费用，确保钱包中有足够的 ETH。
          </p>
        </div>

        {/* 字节码加载状态 */}
        {isLoadingBytecode && (
          <div className="bytecode-status">
            <p>⏳ 正在加载合约字节码...</p>
          </div>
        )}

        {bytecodeError && (
          <div className="bytecode-error">
            <p>❌ 加载字节码失败: {bytecodeError}</p>
            <button onClick={handleReloadBytecode} className="reload-bytecode-btn">
              重试加载
            </button>
          </div>
        )}

        {bytecode && !isLoadingBytecode && (
          <div className="bytecode-loaded">
            <p>✅ 合约字节码已加载（{bytecode.length} 字符）</p>
            <button onClick={handleReloadBytecode} className="reload-bytecode-btn">
              重新加载
            </button>
          </div>
        )}

        {/* 一键部署按钮 */}
        <button
          onClick={handleDeploy}
          className="deploy-button one-click-deploy"
          disabled={!isConnected || isDeploying || isConfirming || !bytecode || isLoadingBytecode}
        >
          {isLoadingBytecode
            ? '加载中...'
            : isConfirming
            ? '确认中...'
            : isDeploying
            ? '部署中...'
            : '🚀 一键部署合约'}
        </button>

        {deployHash && (
          <div className="deploy-status">
            <p>交易哈希: {deployHash}</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${deployHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              在区块链浏览器查看
            </a>
          </div>
        )}

        {isDeployed && deployedAddress && (
          <div className="deploy-success">
            <p>✅ 合约部署成功！</p>
            <p className="deployed-address">
              <strong>合约地址：</strong>
              <code>{deployedAddress}</code>
            </p>
            <p className="next-steps">
              <strong>下一步：</strong>
              <br />
              1. 复制上面的合约地址
              <br />
              2. 更新 <code>.env.local</code> 文件：<code>VITE_NFT_CONTRACT_ADDRESS={deployedAddress}</code>
              <br />
              3. 重启开发服务器
            </p>
          </div>
        )}

        {deployError && (
          <div className="deploy-error">
            <p>❌ 部署失败: {deployError.message}</p>
          </div>
        )}
      </div>

      <div className="manual-deploy-section">
        <h3>💡 提示</h3>
        <p className="command-hint">
          • 合约字节码会自动从 <code>public/basic-nft.json</code> 加载<br />
          • 如果合约文件更新，请点击"重新加载"按钮<br />
          • 部署成功后，合约地址会自动保存到 localStorage<br />
          • 记得更新 <code>.env.local</code> 文件中的 <code>VITE_NFT_CONTRACT_ADDRESS</code>
        </p>
      </div>
    </div>
  )
}

export default ContractDeployer

