# NFT 铸造功能使用指南

## 📋 功能说明

现在你可以：
1. ✅ 上传图片到 Pinata IPFS
2. ✅ 生成并上传 NFT Metadata JSON 到 Pinata
3. ✅ 在商品列表页面铸造 NFT 到区块链

## 🔧 配置步骤

### 1. 部署智能合约

首先需要部署 NFT 合约到区块链：

```bash
cd NFT-Contract
# 使用 Moccasin 部署合约
moccasin run script/deploy-basic-nft.py --network NFTtest
```

部署成功后，会显示合约地址，类似：
```
Contract deployed at: 0x1234567890123456789012345678901234567890
```

### 2. 配置合约地址

在 `Website-React/.env.local` 文件中添加合约地址：

```bash
# NFT 合约地址（部署后更新）
VITE_NFT_CONTRACT_ADDRESS=0x你的合约地址
```

### 3. 更新部署脚本（可选）

如果你想在部署时自动使用 metadata CID，可以修改 `NFT-Contract/script/deploy-basic-nft.py`：

```python
from src import basic_nft
import sys

# 从命令行参数获取 metadata CID
NFT_URI = sys.argv[1] if len(sys.argv) > 1 else "QmTGwitAFiLAkhhEJuRmRrCd63HyjVCRUunidnrXsKhDif"

def deploy_basic_nft():
    contract = basic_nft.deploy()
    contract.mint(NFT_URI)
    print(f"Contract deployed at: {contract.address}")
    print(f"NFT minted with URI: {NFT_URI}")

def moccasin_main():
    deploy_basic_nft()
```

然后使用：
```bash
moccasin run script/deploy-basic-nft.py --network NFTtest -- QmYourMetadataCID
```

## 🎨 使用流程

### 步骤 1: 上传商品

1. 进入"上传商品"页面
2. 选择图片并上传到 IPFS
3. 填写 NFT 详情：
   - NFT 名称
   - 描述
   - 属性（可选）
4. 输入价格
5. 点击"保存商品"

系统会自动：
- 上传图片到 Pinata，获得图片 CID
- 生成 metadata JSON 并上传到 Pinata，获得 metadata CID

### 步骤 2: 铸造 NFT

1. 进入"商品列表"页面
2. 找到已上传的商品（有 metadata CID 的商品会显示 ✅ 标记）
3. 点击"铸造 NFT"按钮
4. 在钱包中确认交易
5. 等待交易确认

## 🔍 功能特性

- ✅ **自动获取 CID**：上传后自动保存 metadata CID
- ✅ **钱包连接**：使用 RainbowKit 连接 MetaMask 等钱包
- ✅ **交易状态**：实时显示铸造状态（等待确认、确认中、成功/失败）
- ✅ **错误处理**：友好的错误提示
- ✅ **详情显示**：在商品详情中显示所有 CID 信息

## ⚠️ 注意事项

1. **合约地址配置**：必须先在 `.env.local` 中配置合约地址
2. **钱包连接**：铸造前需要连接钱包
3. **网络匹配**：确保钱包连接的网络与合约部署的网络一致
4. **Gas 费用**：铸造需要支付 Gas 费用
5. **Metadata CID**：只有上传了 metadata 的商品才能铸造

## 🐛 常见问题

### Q: 点击铸造按钮没有反应？

A: 检查：
- 是否已连接钱包
- 合约地址是否已配置
- 商品是否有 metadata CID

### Q: 交易失败？

A: 可能的原因：
- 网络不匹配（钱包网络与合约网络不一致）
- Gas 费用不足
- 合约地址错误
- 合约未部署

### Q: 如何查看已铸造的 NFT？

A: 可以在以下地方查看：
- 钱包中（如 MetaMask）
- 区块链浏览器（根据网络选择对应的浏览器）
- OpenSea 等 NFT 市场（如果支持该网络）

## 📝 技术细节

### 合约交互

使用 `wagmi` 的 `useWriteContract` hook 调用合约的 `mint` 函数：

```typescript
writeContract({
  address: CONTRACT_ADDRESS,
  abi: NFT_ABI,
  functionName: 'mint',
  args: [metadataCid], // 只需要 CID，合约会自动拼接 BASE_URI
})
```

### URI 格式

合约的 `BASE_URI` 是 `"https://gateway.pinata.cloud/ipfs/"`，所以只需要传入 CID 即可。

例如：
- Metadata CID: `QmXXX...`
- 完整 URI: `https://gateway.pinata.cloud/ipfs/QmXXX...`

## 🚀 下一步

- [ ] 添加批量铸造功能
- [ ] 显示已铸造的 NFT 列表
- [ ] 添加交易历史记录
- [ ] 支持多个网络切换

