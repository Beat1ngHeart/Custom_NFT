// 在浏览器控制台运行此脚本来检查商品数据
// 复制整个文件内容到浏览器控制台运行

(function() {
  console.log('🔍 开始检查商品数据...\n')
  
  const products = JSON.parse(localStorage.getItem('products') || '[]')
  
  if (products.length === 0) {
    console.warn('⚠️ 没有找到商品数据')
    return
  }
  
  console.log(`📦 找到 ${products.length} 个商品\n`)
  
  const issues = []
  
  products.forEach((product, index) => {
    console.log(`\n商品 #${index + 1} (ID: ${product.id}):`)
    console.log('  - 价格:', product.price, 'ETH')
    console.log('  - 卖家地址:', product.seller)
    console.log('  - Metadata CID:', product.metadataCid)
    
    // 检查卖家地址
    if (!product.seller) {
      issues.push({
        productId: product.id,
        issue: '缺少卖家地址',
        severity: 'error'
      })
      console.error('  ❌ 缺少卖家地址')
    } else if (!product.seller.startsWith('0x')) {
      issues.push({
        productId: product.id,
        issue: '卖家地址格式错误（不以0x开头）',
        severity: 'error'
      })
      console.error('  ❌ 卖家地址格式错误（不以0x开头）')
    } else if (product.seller.length !== 42) {
      issues.push({
        productId: product.id,
        issue: `卖家地址长度错误（${product.seller.length}字符，应该是42）`,
        severity: 'error'
      })
      console.error(`  ❌ 卖家地址长度错误（${product.seller.length}字符，应该是42）`)
    } else if (product.seller === '0x0000000000000000000000000000000000000000') {
      issues.push({
        productId: product.id,
        issue: '卖家地址是零地址',
        severity: 'error'
      })
      console.error('  ❌ 卖家地址是零地址')
    } else {
      console.log('  ✅ 卖家地址格式正确')
    }
    
    // 检查价格
    if (!product.price || product.price <= 0) {
      issues.push({
        productId: product.id,
        issue: '价格无效',
        severity: 'error'
      })
      console.error('  ❌ 价格无效')
    } else if (product.price > 1) {
      issues.push({
        productId: product.id,
        issue: `价格过高（${product.price} ETH），建议使用小额测试`,
        severity: 'warning'
      })
      console.warn(`  ⚠️ 价格过高（${product.price} ETH），建议使用小额测试`)
    } else {
      console.log('  ✅ 价格有效')
    }
    
    // 检查 Metadata
    if (!product.metadataCid) {
      issues.push({
        productId: product.id,
        issue: '缺少 Metadata CID',
        severity: 'error'
      })
      console.error('  ❌ 缺少 Metadata CID')
    } else {
      console.log('  ✅ 有 Metadata CID')
    }
  })
  
  console.log('\n\n📊 问题总结:')
  if (issues.length === 0) {
    console.log('✅ 所有商品数据都正常！')
  } else {
    const errors = issues.filter(i => i.severity === 'error')
    const warnings = issues.filter(i => i.severity === 'warning')
    
    if (errors.length > 0) {
      console.error(`\n❌ 发现 ${errors.length} 个错误:`)
      errors.forEach(issue => {
        console.error(`  - 商品 ${issue.productId}: ${issue.issue}`)
      })
    }
    
    if (warnings.length > 0) {
      console.warn(`\n⚠️ 发现 ${warnings.length} 个警告:`)
      warnings.forEach(issue => {
        console.warn(`  - 商品 ${issue.productId}: ${issue.issue}`)
      })
    }
    
    console.log('\n💡 修复建议:')
    console.log('1. 删除有错误的商品')
    console.log('2. 重新上架商品，确保使用正确的钱包地址')
    console.log('3. 使用小额价格测试（例如 0.001 ETH）')
    
    // 提供修复代码
    const goodProducts = products.filter(p => {
      return p.seller && 
             p.seller.startsWith('0x') && 
             p.seller.length === 42 &&
             p.seller !== '0x0000000000000000000000000000000000000000' &&
             p.price && 
             p.price > 0 &&
             p.metadataCid
    })
    
    if (goodProducts.length < products.length) {
      console.log('\n🔧 可以运行以下代码修复商品数据:')
      console.log(`
localStorage.setItem('products', JSON.stringify(${JSON.stringify(goodProducts, null, 2)}))
console.log('✅ 已修复商品数据，保留了 ${goodProducts.length} 个有效商品')
      `)
    }
  }
  
  return {
    total: products.length,
    issues: issues,
    errors: issues.filter(i => i.severity === 'error').length,
    warnings: issues.filter(i => i.severity === 'warning').length
  }
})()

