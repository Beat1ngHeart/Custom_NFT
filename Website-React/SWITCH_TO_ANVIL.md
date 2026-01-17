# 🔄 切换到 Anvil 本地网络指南

## ✅ 已完成的更改

### 1. RainbowKit 配置 (`src/config/rainbowkit.ts`)

- ✅ 将 `tenderlyTestnet` 改为 `anvilLocal`
- ✅ 更新 RPC URL 为 `http://127.0.0.1:8545`
- ✅ 更新 Chain ID 为 `31337`
- ✅ 将 `anvilLocal` 添加到 chains 数组（放在第一位，作为默认网络）

### 2. 钱包工具 (`src/utils/wallet.ts`)

- ✅ 更新 `switchNetwork` 函数中的 RPC URL 为 Anvil 地址
- ✅ 更新 blockExplorerUrls 为本地地址

### 3. 产品列表 (`src/components/ProductList.tsx`)

- ✅ 更新网络检查 Chain ID 从 `623352640` 改为 `31337`
- ✅ 更新错误提示信息

## 🚀 使用步骤

### 步骤 1：启动 Anvil

```bash
cd /home/beat1ngheart/Custom_NFT/NFT-Contract
export PATH="$HOME/.foundry/bin:$PATH"
anvil
```

或者使用启动脚本：

```bash
cd /home/beat1ngheart/Custom_NFT/NFT-Contract
./start-anvil.sh
```

### 步骤 2：在 MetaMask 中添加 Anvil 网络

1. 打开 MetaMask
2. 点击网络下拉菜单
3. 选择"添加网络" → "手动添加网络"
4. 填写以下信息：
   - **网络名称**：`Anvil Local`
   - **RPC URL**：`http://127.0.0.1:8545`
   - **Chain ID**：`31337`
   - **货币符号**：`ETH`
   - **区块浏览器 URL**：`http://127.0.0.1:8545`（可选）

### 步骤 3：导入测试账户

Anvil 启动时会显示测试账户和私钥：

```
Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
...

Private Keys
==================
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...
```

在 MetaMask 中：
1. 点击账户图标
2. 选择"导入账户"
3. 粘贴私钥
4. 确认导入

### 步骤 4：切换到 Anvil 网络

在 MetaMask 中选择 "Anvil Local" 网络。

### 步骤 5：部署合约

1. 访问 `/deploy` 页面
2. 确保钱包连接到 Anvil 网络
3. 部署合约到本地网络

### 步骤 6：测试功能

1. 上架商品（使用 Anvil 测试账户）
2. 购买商品（使用另一个测试账户）
3. 验证转账和 NFT 铸造

## 📋 网络对比

| 特性 | Tenderly | Anvil |
|------|----------|-------|
| Chain ID | 623352640 | 31337 |
| RPC URL | Tenderly 提供的 URL | http://127.0.0.1:8545 |
| 类型 | 远程测试网 | 本地测试网 |
| 速度 | 取决于网络 | 即时（本地） |
| Gas 费用 | 需要测试 ETH | 免费（本地） |
| 持久化 | 是 | 否（重启后重置） |

## ⚠️ 注意事项

1. **Anvil 需要运行**：确保 Anvil 在后台运行，否则无法连接
2. **重启后重置**：Anvil 重启后，所有状态会重置
3. **测试账户**：使用 Anvil 提供的测试账户，每个账户有 10000 ETH
4. **合约地址**：部署到 Anvil 后，需要更新 `.env.local` 中的 `VITE_NFT_CONTRACT_ADDRESS`

## 🔍 验证连接

在浏览器控制台运行：

```javascript
// 检查当前网络
const chainId = await window.ethereum.request({ method: 'eth_chainId' })
console.log('当前 Chain ID:', parseInt(chainId, 16)) // 应该是 31337

// 检查账户
const accounts = await window.ethereum.request({ method: 'eth_accounts' })
console.log('当前账户:', accounts)
```

## 🛠️ 故障排除

### 问题 1：无法连接到 Anvil

**解决**：
- 确保 Anvil 正在运行：`ps aux | grep anvil`
- 检查端口是否被占用：`lsof -i :8545`
- 重启 Anvil

### 问题 2：MetaMask 无法添加网络

**解决**：
- 确保 RPC URL 是 `http://127.0.0.1:8545`（不是 https）
- 确保 Chain ID 是 `31337`（十进制，不是十六进制）

### 问题 3：交易失败

**解决**：
- 确保使用 Anvil 测试账户（有足够的 ETH）
- 确保合约已部署到 Anvil 网络
- 检查合约地址是否正确

## 📝 总结

所有配置已更新为使用 Anvil 本地网络。现在可以：

1. ✅ 启动 Anvil
2. ✅ 在 MetaMask 中添加网络
3. ✅ 部署合约到本地网络
4. ✅ 测试所有功能

享受本地开发的快速体验！🚀

