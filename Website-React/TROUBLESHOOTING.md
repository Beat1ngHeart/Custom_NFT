# 🔧 合约交互失败排查指南

## 常见失败原因

### 1. 合约未重新编译和部署
**问题**：修改合约代码后，如果没有重新编译和部署，前端调用的仍然是旧版本的合约。

**解决方法**：
```bash
cd NFT-Contract
moccasin compile
```
然后访问 `/deploy` 页面重新部署合约。

### 2. ABI 不匹配
**问题**：合约代码已更新，但 ABI 文件没有更新。

**解决方法**：
- 从 `NFT-Contract/out/basic-nft.json` 中提取新的 ABI
- 更新 `Website-React/src/contract/basicNftABI.json`

### 3. Gas 不足
**问题**：交易需要的 Gas 超过设置的限制。

**解决方法**：
- 在钱包中增加 Gas Limit
- 检查合约代码是否有无限循环或复杂计算

### 4. 参数错误
**问题**：传入的参数格式不正确。

**检查项**：
- `seller` 地址必须是有效的以太坊地址（42 字符，以 0x 开头）
- `tokenURI` 必须是有效的字符串
- `value` 必须是有效的 ETH 金额（使用 `parseEther` 转换）

### 5. 卖家地址为零地址
**问题**：商品数据中没有正确保存卖家地址。

**检查方法**：
```javascript
// 在浏览器控制台检查
const products = JSON.parse(localStorage.getItem('products'))
console.log(products)
// 检查每个商品的 seller 字段
```

### 6. 余额不足
**问题**：钱包余额不足以支付商品价格 + Gas 费用。

**解决方法**：
- 确保钱包有足够的 ETH
- 价格应该是合理的（例如 0.001 ETH，而不是 10.999 ETH）

## 调试步骤

### 步骤 1：检查浏览器控制台
打开浏览器开发者工具（F12），查看 Console 标签页的错误信息。

### 步骤 2：检查交易详情
1. 在 MetaMask 中查看失败的交易
2. 点击交易哈希，在区块链浏览器查看详情
3. 查看 "Input Data" 和 "Internal Transactions"

### 步骤 3：验证合约地址
确保 `.env.local` 中的 `VITE_NFT_CONTRACT_ADDRESS` 是正确的合约地址。

### 步骤 4：测试简单调用
先测试 `mint` 函数（不需要支付 ETH），确认合约基本功能正常。

### 步骤 5：检查商品数据
```javascript
// 在浏览器控制台运行
const products = JSON.parse(localStorage.getItem('products'))
products.forEach(p => {
  console.log('商品 ID:', p.id)
  console.log('卖家地址:', p.seller)
  console.log('价格:', p.price, 'ETH')
  console.log('Metadata CID:', p.metadataCid)
})
```

## 常见错误信息

### "execution reverted"
- 合约中的 `assert` 或 `require` 失败
- 检查卖家地址、支付金额等参数

### "insufficient funds"
- 钱包余额不足
- 增加余额或降低价格

### "nonce too low"
- 交易 nonce 错误
- 重置钱包或等待一段时间

### "user rejected"
- 用户在 MetaMask 中拒绝了交易
- 重新发起交易并确认

## 测试建议

1. **先测试 mint 函数**（不需要支付 ETH）
2. **使用小额测试**（例如 0.001 ETH）
3. **检查卖家地址格式**（必须是有效的以太坊地址）
4. **确保合约已重新部署**（使用新编译的字节码）

## 获取帮助

如果以上方法都无法解决问题，请提供：
1. 浏览器控制台的完整错误信息
2. 失败的交易哈希
3. 合约地址
4. 商品数据（seller 地址、价格等）

