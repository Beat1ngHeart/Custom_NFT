# 🔍 交易失败调试指南

## 从 Tenderly 调试器看到的信息

根据你提供的 Tenderly 调试器截图：

1. **交易状态**：`execution reverted` - 合约执行被回滚
2. **发送金额**：`10.999 ETH` - 金额很大，可能是测试
3. **Gas 使用**：`24,800` - 说明执行了一部分就失败了
4. **函数选择器**：`0xc98bb56e` - 这是 `purchase_and_mint` 函数
5. **失败位置**：在合约内部 `REVERT` opcode

## 可能的原因

### 1. 卖家地址问题
**问题**：卖家地址可能是：
- 零地址（`0x0000...0000`）
- 无效地址格式
- 合约地址但没有 `receive()` 或 `fallback()` 函数

**检查方法**：
```javascript
// 在浏览器控制台检查商品数据
const products = JSON.parse(localStorage.getItem('products'))
products.forEach(p => {
  console.log('卖家地址:', p.seller)
  console.log('地址长度:', p.seller?.length)
  console.log('是否以0x开头:', p.seller?.startsWith('0x'))
})
```

### 2. raw_call 失败
**问题**：`raw_call` 在以下情况会失败：
- 目标地址是合约但没有 `receive()` 函数
- 目标地址是合约但 `receive()` 函数 revert
- Gas 不足（虽然不太可能，因为只用了 24,800 gas）

### 3. _safe_mint 失败
**问题**：如果 `msg.sender` 是合约地址但没有实现 `onERC721Received`，`_safe_mint` 会失败。

**检查方法**：
- 确保使用普通钱包地址（EOA），而不是合约地址
- 如果使用合约地址，需要实现 `IERC721Receiver` 接口

### 4. URI 格式问题
**问题**：如果 `uri` 格式不正确，`_set_token_uri` 可能会失败。

**检查方法**：
```javascript
// 检查 metadata CID 格式
const products = JSON.parse(localStorage.getItem('products'))
products.forEach(p => {
  console.log('Metadata CID:', p.metadataCid)
  console.log('Metadata URL:', p.metadataUrl)
})
```

## 解决方案

### 方案 1：检查并修复商品数据

1. **检查卖家地址**：
```javascript
// 在浏览器控制台运行
const products = JSON.parse(localStorage.getItem('products'))
const badProducts = products.filter(p => 
  !p.seller || 
  !p.seller.startsWith('0x') || 
  p.seller.length !== 42 ||
  p.seller === '0x0000000000000000000000000000000000000000'
)

if (badProducts.length > 0) {
  console.error('发现无效商品:', badProducts)
  // 删除或修复这些商品
  const goodProducts = products.filter(p => 
    p.seller && 
    p.seller.startsWith('0x') && 
    p.seller.length === 42 &&
    p.seller !== '0x0000000000000000000000000000000000000000'
  )
  localStorage.setItem('products', JSON.stringify(goodProducts))
  console.log('已修复商品数据')
}
```

2. **重新上架商品**：
   - 确保使用正确的钱包地址上架
   - 确保价格合理（建议使用 0.001 ETH 测试）

### 方案 2：使用更安全的转账方式

我已经修改了合约代码，将 NFT 铸造放在转账之前。这样可以：
- 如果转账失败，NFT 也不会被铸造（避免买家损失）
- 更容易定位问题

### 方案 3：添加错误处理

如果问题仍然存在，可以：
1. 先测试 `mint` 函数（不需要支付 ETH）
2. 使用小额测试（0.001 ETH）
3. 检查卖家地址是否是有效的 EOA 地址

## 调试步骤

### 步骤 1：检查商品数据
```javascript
const products = JSON.parse(localStorage.getItem('products'))
console.table(products.map(p => ({
  id: p.id,
  seller: p.seller,
  price: p.price,
  hasMetadata: !!p.metadataCid
})))
```

### 步骤 2：测试 mint 函数
先测试不需要支付 ETH 的 `mint` 函数，确认合约基本功能正常。

### 步骤 3：检查卖家地址
确保卖家地址是：
- 有效的以太坊地址（42 字符）
- 普通钱包地址（EOA），不是合约地址
- 不是零地址

### 步骤 4：使用小额测试
使用 0.001 ETH 而不是 10.999 ETH 进行测试。

## 常见错误信息对照

| 错误信息 | 可能原因 | 解决方法 |
|---------|---------|---------|
| `execution reverted` | 合约内部 assert 失败 | 检查参数是否正确 |
| `transfer failed` | raw_call 失败 | 检查卖家地址是否有效 |
| `ERC721: transfer to non ERC721Receiver` | _safe_mint 失败 | 确保使用 EOA 地址 |
| `invalid address` | 地址格式错误 | 检查地址格式 |

## 如果仍然失败

请提供：
1. 卖家地址（前 6 位和后 4 位即可）
2. 商品价格
3. 使用的钱包地址类型（EOA 还是合约）
4. Tenderly 调试器的完整错误信息

