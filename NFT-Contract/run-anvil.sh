#!/bin/bash
# 运行 anvil 的脚本（Python 模板工具）

cd "$(dirname "$0")"

# 使用 PYTHONPATH 运行 anvil
export PYTHONPATH="$(pwd)/lib/pypi:$PYTHONPATH"
python3 -m anvil.cli "$@"

