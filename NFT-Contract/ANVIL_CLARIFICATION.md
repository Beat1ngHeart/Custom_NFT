# Anvil 说明

## 重要发现

通过 `moccasin install anvil` 安装的 `anvil` **不是 Foundry 的 anvil**（本地以太坊节点），而是一个 **Python 模板生成工具**。

## 两个不同的 Anvil

### 1. Foundry Anvil（本地区块链节点）
- **用途**：运行本地以太坊节点用于测试
- **安装**：通过 Foundry 安装
- **命令**：`anvil`（启动本地节点）
- **功能**：提供本地 RPC 端点（如 `http://127.0.0.1:8545`）

### 2. Python Anvil（模板生成工具）
- **用途**：从 Jinja 模板生成项目结构
- **安装**：通过 `moccasin install anvil` 安装
- **命令**：`anvil init`（初始化项目结构）
- **功能**：代码生成工具

## 当前情况

你的 `moccasin.toml` 中配置了：

```toml
[networks.anvil]
url = "http://127.0.0.1:8545"
chain_id = 31337
```

这个配置期望的是 **Foundry Anvil**（本地节点），而不是 Python anvil 包。

## 解决方案

### 方案 1：安装 Foundry Anvil（推荐）

如果你想使用本地测试网络：

```bash
# 安装 Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 启动 anvil
anvil
```

### 方案 2：使用现有的测试网络

你的配置中已经有其他测试网络：

```toml
[networks.NFTtest]
url = "https://virtual.sepolia.eu.rpc.tenderly.co/4fb5e0c9-c961-48ae-ba4f-ef058cdc5450"
```

可以直接使用这个网络，不需要本地 anvil。

### 方案 3：使用 Python Anvil（如果需要模板生成）

如果确实需要 Python anvil 工具，使用提供的脚本：

```bash
cd /home/beat1ngheart/Custom_NFT/NFT-Contract
./run-anvil.sh --help
```

## 运行 Python Anvil

已创建 `run-anvil.sh` 脚本，可以这样使用：

```bash
cd /home/beat1ngheart/Custom_NFT/NFT-Contract
./run-anvil.sh --help
./run-anvil.sh init
```

## 总结

- **Python anvil**：已安装，用于代码生成（不是区块链节点）
- **Foundry anvil**：需要单独安装，用于本地测试网络
- **当前项目**：可以使用 Tenderly 测试网络，不需要本地 anvil

## 对于你的项目

由于你已经在使用 Tenderly 测试网络，**不需要本地 anvil**。可以：

1. 继续使用 Tenderly 测试网络
2. 或者安装 Foundry 的 anvil 用于本地测试
3. Python anvil 包可以保留（如果不需要可以移除）

