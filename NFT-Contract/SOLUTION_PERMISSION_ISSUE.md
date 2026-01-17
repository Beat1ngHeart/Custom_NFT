# 解决 Snekmate ERC721 权限问题

## 问题分析

根据你的分析，问题出在 Snekmate ERC721 库的权限检查。当使用 `initializes: erc721[ownable := ow]` 时，库可能会检查调用者是否为 owner。

## 解决方案

### 方案 1：移除 Ownable 绑定（推荐用于公开铸造）

如果希望任何人都可以铸造 NFT，可以移除 ownable 绑定：

```vyper
from snekmate.tokens import erc721
# 移除 ownable 导入和绑定

initializes: erc721  # 不绑定 ownable

@deploy
def __init__():
    erc721.__init__(NAME, SYMBOL, BASE_URI, NAME, EIP_712_VERSION)
```

**优点**：
- 任何人都可以调用 `mint` 和 `purchase_and_mint`
- 不需要权限检查

**缺点**：
- 失去了合约的 owner 控制功能
- 无法限制铸造权限

### 方案 2：使用 Minter 角色（推荐用于生产环境）

Snekmate ERC721 可能支持 minter 角色。检查是否有 `set_minter` 函数：

```vyper
@external
def set_minter(minter: address, status: bool):
    # 如果库支持，设置 minter 角色
    erc721.set_minter(minter, status)
```

然后在部署时设置 minter：

```vyper
@deploy
def __init__():
    ow.__init__()
    erc721.__init__(NAME, SYMBOL, BASE_URI, NAME, EIP_712_VERSION)
    # 设置合约本身为 minter，允许任何人通过 purchase_and_mint 铸造
    erc721.set_minter(self, True)
```

### 方案 3：使用内部函数（如果库提供）

检查 Snekmate 是否提供不需要权限检查的内部函数，例如：
- `_mint`（而不是 `_safe_mint`）
- 或者直接操作状态变量

### 方案 4：修改初始化方式

尝试不同的初始化方式：

```vyper
# 方式 A：不绑定 ownable
initializes: erc721

# 方式 B：只初始化 ownable，不绑定到 erc721
initializes: ow
initializes: erc721  # 不绑定
```

## 测试步骤

### 步骤 1：测试 mint 函数

使用非部署者钱包调用 `mint` 函数：

```python
# 在测试脚本中
contract = basic_nft.deploy()
# 使用不同的账户调用
contract.mint(uri, sender=non_owner_account)
```

如果 `mint` 也失败，说明确实是权限问题。

### 步骤 2：检查库文档

查看 Snekmate ERC721 的文档，确认：
- 是否有 `set_minter` 函数
- `_safe_mint` 是否需要权限
- 是否有公共的 mint 函数

### 步骤 3：检查编译后的 ABI

查看 `NFT-Contract/out/basic-nft.json`，检查是否有：
- `set_minter` 函数
- `minter` 状态变量
- 其他权限相关函数

## 推荐的修改

基于你的需求（任何人都可以购买并铸造），我推荐**方案 1**：

```vyper
#pragma version ^0.4.0

from snekmate.tokens import erc721
# 移除 ownable 导入

# 不绑定 ownable
initializes: erc721

NAME: constant(String[25]) = "Basic NFT"
SYMBOL: constant(String[5]) = "BNFT"
BASE_URI: constant(String[80]) = "https://gateway.pinata.cloud/ipfs/"
EIP_712_VERSION: constant(String[20]) = "1"

@deploy
def __init__():
    # 移除 ow.__init__()
    erc721.__init__(NAME, SYMBOL, BASE_URI, NAME, EIP_712_VERSION)
    
@external
def mint(uri: String[432]):
    token_id: uint256 = erc721._counter
    erc721._counter = token_id + 1
    erc721._safe_mint(msg.sender, token_id, b"")
    erc721._set_token_uri(token_id, uri)

@external
@payable
@nonreentrant("lock")
def purchase_and_mint(uri: String[432], seller: address):
    assert msg.value > 0, "Payment must be greater than 0"
    assert seller != empty(address), "Invalid seller address"

    token_id: uint256 = erc721._counter
    erc721._counter = token_id + 1

    erc721._safe_mint(msg.sender, token_id, b"")
    erc721._set_token_uri(token_id, uri)
    
    send(seller, msg.value)
```

## 注意事项

1. **send() 函数**：确保 Vyper 版本支持 `send()` 函数。如果不支持，使用 `raw_call(seller, b"", value=msg.value)`

2. **empty(address)**：确保语法正确。如果不支持，使用零地址检查：
   ```vyper
   assert seller != 0x0000000000000000000000000000000000000000, "Invalid seller address"
   ```

3. **重新编译和部署**：修改后必须重新编译和部署合约

## 验证方法

修改后，测试：
1. 使用非部署者钱包调用 `mint` - 应该成功
2. 使用非部署者钱包调用 `purchase_and_mint` - 应该成功
3. 检查卖家是否收到 ETH
4. 检查 NFT 是否被正确铸造

