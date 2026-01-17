// 快速检查购买参数 - 在浏览器控制台运行

// 方法 1: 直接查看商品数据
const products = JSON.parse(localStorage.getItem('products') || '[]')
console.log('📦 商品列表:')
products.forEach((p, i) => {
  console.log(`\n商品 ${i + 1}:`)
  console.log('  卖家地址:', p.seller)
  console.log('  地址有效:', p.seller && p.seller.startsWith('0x') && p.seller.length === 42 ? '✅' : '❌')
  console.log('  价格:', p.price, 'ETH')
  console.log('  Metadata CID:', p.metadataCid)
})

// 方法 2: 检查合约地址
const contractAddr = import.meta?.env?.VITE_NFT_CONTRACT_ADDRESS || localStorage.getItem('nft_contract_address')
console.log('\n📋 合约地址:', contractAddr || '未配置')

// 方法 3: 检查是否有问题
const issues = []
products.forEach(p => {
  if (!p.seller || !p.seller.startsWith('0x') || p.seller.length !== 42) {
    issues.push(`商品 ${p.id}: 卖家地址无效`)
  }
  if (!p.price || p.price <= 0) {
    issues.push(`商品 ${p.id}: 价格无效`)
  }
  if (!p.metadataCid) {
    issues.push(`商品 ${p.id}: 缺少 Metadata CID`)
  }
})

if (issues.length > 0) {
  console.error('\n❌ 发现问题:')
  issues.forEach(i => console.error('  -', i))
} else {
  console.log('\n✅ 所有商品数据都正常！')
}

