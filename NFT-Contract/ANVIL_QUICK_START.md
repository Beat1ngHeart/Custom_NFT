# ⚡ Anvil 快速启动指南

## ✅ 安装完成

Foundry Anvil 已成功安装！

## 🚀 启动 Anvil

### 方法 1：使用启动脚本

```bash
cd /home/beat1ngheart/Custom_NFT/NFT-Contract
./start-anvil.sh
```

### 方法 2：直接运行

```bash
# 确保 PATH 包含 Foundry
export PATH="$HOME/.foundry/bin:$PATH"

# 启动 anvil
anvil
```

### 方法 3：后台运行

```bash
export PATH="$HOME/.foundry/bin:$PATH"
cd /home/beat1ngheart/Custom_NFT/NFT-Contract
nohup anvil > anvil.log 2>&1 &
echo "Anvil 已在后台运行"
echo "查看日志: tail -f anvil.log"
echo "停止: pkill anvil"
```

## 📋 默认配置

- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `31337`
- **端口**: `8545`
- **测试账户**: 10 个（每个 10000 ETH）

## 🔗 连接到 MetaMask

1. **启动 anvil**（会显示账户和私钥）

2. **在 MetaMask 中添加网络**：
   - 网络名称：`Anvil Local`
   - RPC URL：`http://127.0.0.1:8545`
   - Chain ID：`31337`
   - 货币符号：`ETH`

3. **导入测试账户**：
   - 复制 anvil 启动时显示的私钥
   - 在 MetaMask 中导入账户

## ✅ 验证运行

启动后，你应该看到：

```
Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
...

Listening on 127.0.0.1:8545
```

## 🛑 停止 Anvil

- **前台运行**：按 `Ctrl+C`
- **后台运行**：`pkill anvil`

## 💡 提示

如果新开终端找不到 `anvil` 命令，运行：

```bash
export PATH="$HOME/.foundry/bin:$PATH"
```

或者添加到 `~/.bashrc`（已自动添加，重新加载 shell 即可）。

