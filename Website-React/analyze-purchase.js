// 分析购买参数 - 在浏览器控制台运行

const purchaseParams = {
  contractAddress: '0x1ffec56218de5876359e252b802c8c58aa5f5154',
  tokenURI: 'QmQAMfo1Mq6EpXv6PwaHo9NTcXY2Nx5JPTCtobaer63rQ2',
  seller: '0x9A279129923b24C35B5BC4Fe03993c99FDdFD9c5',
  price: 10.999,
  priceInWei: '10999000000000000000'
}

console.log('🔍 分析购买参数:\n')
console.log('1. 合约地址:', purchaseParams.contractAddress)
console.log('   ✅ 长度:', purchaseParams.contractAddress.length, '字符')
console.log('   ✅ 格式:', purchaseParams.contractAddress.startsWith('0x') ? '正确' : '错误')

console.log('\n2. 卖家地址:', purchaseParams.seller)
console.log('   ✅ 长度:', purchaseParams.seller.length, '字符')
console.log('   ✅ 格式:', purchaseParams.seller.startsWith('0x') ? '正确' : '错误')
console.log('   ✅ 是否为零地址:', purchaseParams.seller === '0x0000000000000000000000000000000000000000' ? '是（错误）' : '否（正确）')
console.log('   ⚠️  注意: 如果这是合约地址，需要实现 receive() 或 fallback() 函数')

console.log('\n3. Token URI:', purchaseParams.tokenURI)
console.log('   ✅ 格式: IPFS CID')

console.log('\n4. 价格:', purchaseParams.price, 'ETH')
console.log('   ✅ Wei:', purchaseParams.priceInWei)
console.log('   ⚠️  金额较大，建议使用 0.001 ETH 测试')

console.log('\n📋 参数验证结果:')
const isValid = 
  purchaseParams.contractAddress.length === 42 &&
  purchaseParams.seller.length === 42 &&
  purchaseParams.seller !== '0x0000000000000000000000000000000000000000' &&
  purchaseParams.tokenURI &&
  purchaseParams.price > 0

if (isValid) {
  console.log('✅ 所有参数格式都正确')
  console.log('\n💡 可能的问题:')
  console.log('1. 合约代码可能还没有重新编译和部署')
  console.log('2. 卖家地址可能是合约地址，无法接收 ETH')
  console.log('3. 价格过高，钱包余额可能不足')
  console.log('4. Gas 设置可能不足')
  
  console.log('\n🔧 建议:')
  console.log('1. 确保合约已重新编译: cd NFT-Contract && moccasin compile')
  console.log('2. 确保合约已重新部署（使用新的字节码）')
  console.log('3. 使用小额测试（0.001 ETH）')
  console.log('4. 检查卖家地址是否是普通钱包地址（EOA）')
} else {
  console.log('❌ 参数验证失败')
}

// 检查卖家地址是否是合约
console.log('\n🔍 检查卖家地址类型:')
console.log('提示: 在区块链浏览器（如 Etherscan）输入卖家地址，查看是否是合约地址')
console.log('如果是合约地址，需要实现 receive() 或 fallback() 函数来接收 ETH')

