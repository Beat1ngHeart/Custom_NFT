# Anvil 使用指南

## 问题

通过 `moccasin install anvil` 安装后，直接运行 `anvil` 命令找不到。

## 原因

`anvil` 被安装到了项目的 `lib/pypi/bin/` 目录，不在系统 PATH 中。

## 解决方案

### 方法 1：使用完整路径运行（推荐）

```bash
cd /home/beat1ngheart/Custom_NFT/NFT-Contract
./lib/pypi/bin/anvil
```

### 方法 2：添加到 PATH（临时）

```bash
export PATH="$PATH:/home/beat1ngheart/Custom_NFT/NFT-Contract/lib/pypi/bin"
anvil
```

### 方法 3：创建符号链接

```bash
cd /home/beat1ngheart/Custom_NFT/NFT-Contract
ln -s lib/pypi/bin/anvil ./anvil
./anvil
```

### 方法 4：使用 Moccasin 运行（如果支持）

Moccasin 可能提供了运行 anvil 的方式，检查文档：
```bash
moccasin --help
# 或
python -m moccasin --help
```

## Anvil 配置

根据 `moccasin.toml`，anvil 网络配置为：

```toml
[networks.anvil]
url = "http://127.0.0.1:8545"
prompt_live = false
save_to_db = false
chain_id = 31337
```

## 启动 Anvil 本地网络

```bash
cd /home/beat1ngheart/Custom_NFT/NFT-Contract
./lib/pypi/bin/anvil
```

默认配置：
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- 端口: `8545`

## 常用选项

```bash
# 启动并指定端口
./lib/pypi/bin/anvil --port 8545

# 启动并显示账户私钥
./lib/pypi/bin/anvil --accounts 10

# 启动并设置初始余额
./lib/pypi/bin/anvil --balance 1000

# 查看所有选项
./lib/pypi/bin/anvil --help
```

## 注意事项

1. **Anvil 是 Foundry 工具链的一部分**：如果系统已安装 Foundry，可以直接使用系统的 `anvil` 命令
2. **Moccasin 的 anvil**：这是通过 pip 安装的 Python 包，可能功能有限
3. **推荐使用系统安装的 Anvil**：如果可能，建议通过 Foundry 安装完整的 anvil

## 安装系统级 Anvil（推荐）

如果你想使用完整的 Foundry anvil：

```bash
# 安装 Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 然后可以直接使用
anvil
```

## 当前项目使用

对于当前项目，你可以：

1. **使用 Moccasin 的 anvil**（已安装）：
   ```bash
   ./lib/pypi/bin/anvil
   ```

2. **或者使用系统安装的 anvil**（如果已安装 Foundry）

3. **或者使用其他本地网络**：如 Hardhat Network、Ganache 等

