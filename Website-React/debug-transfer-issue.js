// 调试转账问题 - 在浏览器控制台运行
// 检查卖家地址和商品数据

(async function() {
  console.log('🔍 调试转账问题...\n')
  
  // 1. 检查商品数据
  const products = JSON.parse(localStorage.getItem('products') || '[]')
  console.log(`📦 找到 ${products.length} 个商品\n`)
  
  products.forEach((p, i) => {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`商品 #${i + 1} (ID: ${p.id})`)
    console.log(`${'='.repeat(60)}`)
    
    // 检查卖家地址
    console.log('\n📍 卖家地址检查:')
    if (!p.seller) {
      console.error('❌ 缺少卖家地址！')
      return
    }
    
    console.log('  地址值:', p.seller)
    console.log('  类型:', typeof p.seller)
    console.log('  长度:', p.seller.length, '字符')
    
    // 格式检查
    const isValidFormat = /^0x[a-fA-F0-9]{40}$/.test(p.seller)
    console.log('  格式:', isValidFormat ? '✅ 正确' : '❌ 错误')
    
    // 零地址检查
    const isZeroAddress = p.seller === '0x0000000000000000000000000000000000000000' || 
                         p.seller.toLowerCase() === '0x0000000000000000000000000000000000000000'
    console.log('  零地址:', isZeroAddress ? '❌ 是零地址（错误）' : '✅ 不是零地址')
    
    // 价格检查
    console.log('\n💰 价格检查:')
    console.log('  价格:', p.price, 'ETH')
    console.log('  价格类型:', typeof p.price)
    console.log('  价格有效:', p.price && p.price > 0 ? '✅' : '❌')
    
    // Metadata 检查
    console.log('\n📄 Metadata 检查:')
    console.log('  CID:', p.metadataCid || '❌ 缺少')
    console.log('  URL:', p.metadataUrl || '❌ 缺少')
    
    // 总结
    console.log('\n📋 总结:')
    const issues = []
    if (!p.seller) issues.push('缺少卖家地址')
    if (!isValidFormat) issues.push('地址格式错误')
    if (isZeroAddress) issues.push('是零地址')
    if (!p.price || p.price <= 0) issues.push('价格无效')
    if (!p.metadataCid) issues.push('缺少 Metadata CID')
    
    if (issues.length === 0) {
      console.log('✅ 所有检查都通过！')
      console.log('\n💡 如果转账仍然失败，可能的原因:')
      console.log('1. Gas 不足 - 增加 Gas Limit')
      console.log('2. 合约代码问题 - 确保已重新编译和部署')
      console.log('3. 网络问题 - 检查网络连接')
      console.log('4. 卖家地址在区块链上不存在（虽然格式正确）')
    } else {
      console.error('❌ 发现问题:')
      issues.forEach(issue => console.error(`  - ${issue}`))
    }
  })
  
  // 2. 检查当前连接的钱包地址
  console.log('\n\n🔐 当前钱包连接:')
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        console.log('  当前地址:', accounts[0])
        console.log('  格式:', /^0x[a-fA-F0-9]{40}$/.test(accounts[0]) ? '✅ 正确' : '❌ 错误')
      } else {
        console.log('  ⚠️ 未连接钱包')
      }
    } catch (error) {
      console.error('  检查失败:', error.message)
    }
  } else {
    console.log('  ⚠️ 未检测到 MetaMask')
  }
  
  // 3. 检查合约地址
  console.log('\n\n📋 合约地址:')
  const contractAddr = import.meta?.env?.VITE_NFT_CONTRACT_ADDRESS || 
                       localStorage.getItem('nft_contract_address')
  if (contractAddr) {
    console.log('  地址:', contractAddr)
    console.log('  格式:', /^0x[a-fA-F0-9]{40}$/.test(contractAddr) ? '✅ 正确' : '❌ 错误')
  } else {
    console.error('  ❌ 合约地址未配置')
  }
  
  console.log('\n\n💡 调试建议:')
  console.log('1. 确保卖家地址格式正确（42字符，以0x开头）')
  console.log('2. 确保卖家地址不是零地址')
  console.log('3. 确保价格有效（大于0）')
  console.log('4. 确保合约已重新编译和部署')
  console.log('5. 检查交易 Gas Limit 是否足够')
  console.log('6. 在区块链浏览器查看失败的交易详情')
  
})()

