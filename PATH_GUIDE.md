# 📁 项目路径指南

## 项目结构

```
Custom_NFT/                    # 项目根目录
├── NFT-Contract/              # 智能合约目录
│   ├── src/
│   │   └── basic_nft.vy      # 合约源码
│   ├── out/                   # 编译输出
│   └── script/                # 部署脚本
└── Website-React/             # 前端项目目录
    ├── src/                   # 源代码
    └── public/                # 公共文件
```

## 常用路径操作

### 从 Website-React 目录到 NFT-Contract 目录

```bash
# 方法 1：先回到根目录，再进入 NFT-Contract
cd ..
cd NFT-Contract

# 方法 2：直接使用相对路径
cd ../NFT-Contract

# 方法 3：使用绝对路径
cd /home/beat1ngheart/Custom_NFT/NFT-Contract
```

### 从 NFT-Contract 目录到 Website-React 目录

```bash
# 方法 1：先回到根目录，再进入 Website-React
cd ..
cd Website-React

# 方法 2：直接使用相对路径
cd ../Website-React
```

### 从任何位置回到项目根目录

```bash
# 如果在子目录中
cd /home/beat1ngheart/Custom_NFT

# 或者使用相对路径（如果在子目录中）
cd ../..  # 根据当前深度调整
```

## 常用命令

### 编译合约

```bash
# 在 NFT-Contract 目录下
cd /home/beat1ngheart/Custom_NFT/NFT-Contract
moccasin compile
```

### 运行前端

```bash
# 在 Website-React 目录下
cd /home/beat1ngheart/Custom_NFT/Website-React
npm run dev
```

### 快速切换

```bash
# 使用别名（添加到 ~/.bashrc）
alias nft-contract='cd /home/beat1ngheart/Custom_NFT/NFT-Contract'
alias nft-web='cd /home/beat1ngheart/Custom_NFT/Website-React'
alias nft-root='cd /home/beat1ngheart/Custom_NFT'

# 然后就可以直接使用
nft-contract  # 进入合约目录
nft-web       # 进入前端目录
nft-root      # 回到根目录
```

## 当前目录检查

```bash
# 查看当前目录
pwd

# 查看目录内容
ls -la

# 查看项目结构
tree -L 2  # 如果安装了 tree 命令
```

