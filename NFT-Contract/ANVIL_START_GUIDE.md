# 🚀 启动 Anvil 本地测试网络

## 安装状态

✅ Foundry 已成功安装！
- anvil 位置：`~/.foundry/bin/anvil`
- 版本：1.5.1-stable

## 启动方法

### 方法 1：使用启动脚本（推荐）

```bash
cd /home/beat1ngheart/Custom_NFT/NFT-Contract
./start-anvil.sh
```

### 方法 2：直接运行命令

```bash
# 确保 PATH 包含 Foundry
export PATH="$HOME/.foundry/bin:$PATH"

# 启动 anvil
anvil
```

### 方法 3：后台运行

```bash
export PATH="$HOME/.foundry/bin:$PATH"
anvil > anvil.log 2>&1 &
echo "Anvil 已在后台运行，PID: $!"
echo "查看日志: tail -f anvil.log"
echo "停止: kill $!"
```

## 默认配置

根据 `moccasin.toml`：

- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `31337`
- **端口**: `8545`

## 常用选项

```bash
# 启动并显示账户私钥
anvil --accounts 10

# 启动并设置初始余额（每个账户 1000 ETH）
anvil --balance 1000

# 启动并指定端口
anvil --port 8545

# 启动并设置区块时间
anvil --block-time 2

# 查看所有选项
anvil --help
```

## 测试账户

Anvil 会自动创建 10 个测试账户，每个账户有 10000 ETH。启动时会显示：
- 账户地址
- 私钥（用于导入到 MetaMask）

## 连接到 MetaMask

1. 启动 anvil
2. 复制显示的账户私钥
3. 在 MetaMask 中：
   - 添加网络：`http://127.0.0.1:8545`
   - Chain ID: `31337`
   - 导入账户：使用显示的私钥

## 停止 Anvil

- 如果在前台运行：按 `Ctrl+C`
- 如果在后台运行：`kill <PID>` 或 `pkill anvil`

## 注意事项

1. **PATH 配置**：如果新开终端，可能需要重新加载：
   ```bash
   source ~/.bashrc
   # 或
   export PATH="$HOME/.foundry/bin:$PATH"
   ```

2. **端口占用**：如果 8545 端口被占用，anvil 会报错。可以：
   - 停止占用端口的进程
   - 或使用 `--port` 指定其他端口

3. **持久化**：默认情况下，anvil 重启后状态会重置。如果需要持久化，使用 `--db-path` 选项。

## 验证运行

启动后，你应该看到类似输出：

```
Available Accounts
==================
(0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
...

Private Keys
==================
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...

Listening on 127.0.0.1:8545
```

## 使用 Moccasin 连接到 Anvil

在 `moccasin.toml` 中已经配置了 anvil 网络：

```toml
[networks.anvil]
url = "http://127.0.0.1:8545"
chain_id = 31337
```

启动 anvil 后，可以使用 Moccasin 部署和测试合约。

