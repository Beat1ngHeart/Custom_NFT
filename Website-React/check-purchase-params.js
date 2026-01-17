// 在浏览器控制台运行此脚本来检查购买参数
// 复制整个文件内容到浏览器控制台运行

(function() {
  console.log('🔍 检查购买参数...\n')
  
  // 获取商品数据
  const products = JSON.parse(localStorage.getItem('products') || '[]')
  
  if (products.length === 0) {
    console.warn('⚠️ 没有找到商品数据')
    return
  }
  
  console.log(`📦 找到 ${products.length} 个商品\n`)
  
  // 检查每个商品的购买参数
  products.forEach((product, index) => {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`商品 #${index + 1} (ID: ${product.id})`)
    console.log(`${'='.repeat(60)}`)
    
    // 检查卖家地址
    console.log('\n📍 卖家地址:')
    if (!product.seller) {
      console.error('  ❌ 缺少卖家地址')
    } else {
      console.log('  ✅ 地址:', product.seller)
      console.log('  ✅ 长度:', product.seller.length, '字符')
      console.log('  ✅ 格式:', product.seller.startsWith('0x') ? '正确' : '错误')
      console.log('  ✅ 是否为零地址:', product.seller === '0x0000000000000000000000000000000000000000' ? '是（错误）' : '否（正确）')
      
      // 检查地址校验和
      if (product.seller.length === 42) {
        const checksum = product.seller.slice(2).toLowerCase()
        const hasMixedCase = /[a-f]/.test(product.seller.slice(2)) && /[A-F]/.test(product.seller.slice(2))
        console.log('  ✅ 校验和格式:', hasMixedCase ? '混合大小写（可能是校验和）' : '全小写')
      }
    }
    
    // 检查价格
    console.log('\n💰 价格:')
    if (!product.price) {
      console.error('  ❌ 缺少价格')
    } else {
      console.log('  ✅ ETH:', product.price)
      console.log('  ✅ 类型:', typeof product.price)
      
      // 转换为 Wei
      try {
        const priceInWei = BigInt(Math.floor(product.price * 1e18))
        console.log('  ✅ Wei:', priceInWei.toString())
        console.log('  ⚠️ 价格评估:', product.price > 1 ? '过高（建议使用 0.001 ETH 测试）' : '合理')
      } catch (e) {
        console.error('  ❌ 价格转换失败:', e.message)
      }
    }
    
    // 检查 Metadata
    console.log('\n📄 Metadata:')
    if (!product.metadataCid) {
      console.error('  ❌ 缺少 Metadata CID')
    } else {
      console.log('  ✅ CID:', product.metadataCid)
      console.log('  ✅ URL:', product.metadataUrl || '未设置')
      
      // 模拟 formatTokenURI
      let tokenURI = product.metadataCid
      if (tokenURI.startsWith('http')) {
        const match = tokenURI.match(/ipfs\/([^/?]+)/)
        if (match) {
          tokenURI = match[1]
        }
      } else if (tokenURI.startsWith('ipfs://')) {
        tokenURI = tokenURI.replace('ipfs://', '')
      }
      console.log('  ✅ 格式化后的 Token URI:', tokenURI)
    }
    
    // 检查合约地址
    console.log('\n📋 合约地址:')
    const contractAddress = import.meta?.env?.VITE_NFT_CONTRACT_ADDRESS || 
                           localStorage.getItem('nft_contract_address') ||
                           '未配置'
    console.log('  ', contractAddress)
    
    if (contractAddress && contractAddress !== '未配置') {
      console.log('  ✅ 长度:', contractAddress.length, '字符')
      console.log('  ✅ 格式:', contractAddress.startsWith('0x') ? '正确' : '错误')
    } else {
      console.warn('  ⚠️ 合约地址未配置')
    }
    
    // 生成完整的购买参数对象
    console.log('\n📦 完整购买参数:')
    const purchaseParams = {
      contractAddress: contractAddress !== '未配置' ? contractAddress : null,
      tokenURI: product.metadataCid ? (() => {
        let uri = product.metadataCid
        if (uri.startsWith('http')) {
          const match = uri.match(/ipfs\/([^/?]+)/)
          if (match) return match[1]
        } else if (uri.startsWith('ipfs://')) {
          return uri.replace('ipfs://', '')
        }
        return uri
      })() : null,
      seller: product.seller,
      price: product.price,
      priceInWei: product.price ? BigInt(Math.floor(product.price * 1e18)).toString() : null
    }
    
    console.log(JSON.stringify(purchaseParams, null, 2))
    
    // 验证参数
    console.log('\n✅ 参数验证:')
    const isValid = 
      purchaseParams.contractAddress &&
      purchaseParams.contractAddress.startsWith('0x') &&
      purchaseParams.contractAddress.length === 42 &&
      purchaseParams.tokenURI &&
      purchaseParams.seller &&
      purchaseParams.seller.startsWith('0x') &&
      purchaseParams.seller.length === 42 &&
      purchaseParams.seller !== '0x0000000000000000000000000000000000000000' &&
      purchaseParams.price > 0 &&
      purchaseParams.priceInWei
    
    if (isValid) {
      console.log('  ✅ 所有参数都有效，可以尝试购买')
    } else {
      console.error('  ❌ 参数验证失败，请检查以下问题:')
      if (!purchaseParams.contractAddress) console.error('    - 合约地址未配置')
      if (!purchaseParams.tokenURI) console.error('    - Token URI 无效')
      if (!purchaseParams.seller || purchaseParams.seller.length !== 42) console.error('    - 卖家地址无效')
      if (!purchaseParams.price || purchaseParams.price <= 0) console.error('    - 价格无效')
    }
  })
  
  console.log('\n\n💡 提示:')
  console.log('1. 如果卖家地址无效，请重新上架商品')
  console.log('2. 如果价格过高，建议使用 0.001 ETH 测试')
  console.log('3. 确保合约地址已正确配置')
  console.log('4. 确保合约已重新编译和部署（如果修改了合约代码）')
  
  return {
    products: products,
    validProducts: products.filter(p => 
      p.seller && 
      p.seller.startsWith('0x') && 
      p.seller.length === 42 &&
      p.seller !== '0x0000000000000000000000000000000000000000' &&
      p.price && 
      p.price > 0 &&
      p.metadataCid
    )
  }
})()

