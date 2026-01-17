// 检查卖家地址类型 - 在浏览器控制台运行
// 需要先连接钱包

(async function() {
  console.log('🔍 检查卖家地址类型...\n')
  
  // 检查是否连接了钱包
  if (!window.ethereum) {
    console.error('❌ 请先连接钱包（MetaMask）')
    return
  }
  
  // 获取商品数据
  const products = JSON.parse(localStorage.getItem('products') || '[]')
  
  if (products.length === 0) {
    console.warn('⚠️ 没有找到商品数据')
    return
  }
  
  console.log(`📦 找到 ${products.length} 个商品\n`)
  
  // 使用 ethers.js 或 web3.js 检查地址类型
  // 这里使用 ethers.js（如果已安装）
  try {
    // 动态导入 ethers（如果可用）
    let ethers
    if (typeof window.ethers !== 'undefined') {
      ethers = window.ethers
    } else {
      console.warn('⚠️ ethers.js 未加载，使用 fetch API 检查')
    }
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const sellerAddress = product.seller
      
      console.log(`\n${'='.repeat(60)}`)
      console.log(`商品 #${i + 1} (ID: ${product.id})`)
      console.log(`${'='.repeat(60)}`)
      console.log('卖家地址:', sellerAddress)
      console.log('价格:', product.price, 'ETH')
      
      if (!sellerAddress) {
        console.error('❌ 缺少卖家地址')
        continue
      }
      
      // 检查地址格式
      if (!sellerAddress.startsWith('0x') || sellerAddress.length !== 42) {
        console.error('❌ 地址格式错误')
        continue
      }
      
      // 检查是否是合约地址
      try {
        // 方法 1：使用 ethers.js（如果可用）
        if (ethers) {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const code = await provider.getCode(sellerAddress)
          
          if (code === '0x' || code === '0x0') {
            console.log('✅ 卖家地址是普通钱包地址（EOA）')
            console.log('   → 可以正常接收 ETH')
          } else {
            console.error('❌ 卖家地址是合约地址！')
            console.error('   合约代码长度:', code.length, '字节')
            console.error('   ⚠️  如果合约没有实现 receive() 函数，转账会失败')
            console.error('   💡 建议：使用普通钱包地址作为卖家地址')
          }
        } else {
          // 方法 2：使用 fetch API（需要 RPC 端点）
          console.log('⚠️ 无法直接检查，需要 RPC 端点')
          console.log('💡 提示：在区块链浏览器（如 Etherscan）输入地址查看')
          console.log('   如果是合约地址，会显示合约信息')
        }
      } catch (error) {
        console.error('❌ 检查失败:', error.message)
        console.log('💡 提示：在区块链浏览器（如 Etherscan）输入地址查看')
      }
    }
    
    console.log('\n\n📋 总结:')
    console.log('1. 如果卖家地址是合约地址，需要实现 receive() 函数')
    console.log('2. 建议使用普通钱包地址（EOA）作为卖家地址')
    console.log('3. 在区块链浏览器检查地址类型：')
    console.log('   - 输入地址查看详情')
    console.log('   - 如果显示"Contract"，说明是合约地址')
    console.log('   - 如果只显示余额和交易，说明是普通钱包地址')
    
  } catch (error) {
    console.error('❌ 检查过程出错:', error)
  }
})()

