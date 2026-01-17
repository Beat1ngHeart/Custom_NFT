#!/bin/bash
# 启动 Anvil 本地测试网络

# 确保 PATH 包含 Foundry
export PATH="$HOME/.foundry/bin:$PATH"

echo "🚀 启动 Anvil 本地测试网络..."
echo ""
echo "配置信息："
echo "  - RPC URL: http://127.0.0.1:8545"
echo "  - Chain ID: 31337"
echo "  - 端口: 8545"
echo ""
echo "按 Ctrl+C 停止"
echo ""

# 启动 anvil
anvil

