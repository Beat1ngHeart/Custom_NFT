# 🚀 快速命令参考

## 目录结构

```
Custom_NFT/              # 项目根目录
├── NFT-Contract/        # 合约目录（同级）
└── Website-React/      # 前端目录（同级）
```

## 从 Website-React 到 NFT-Contract

**❌ 错误**：
```bash
cd NFT-Contract  # 失败！NFT-Contract 不在 Website-React 目录下
```

**✅ 正确**：
```bash
# 方法 1：使用相对路径（推荐）
cd ../NFT-Contract

# 方法 2：使用绝对路径
cd /home/beat1ngheart/Custom_NFT/NFT-Contract

# 方法 3：先回到根目录，再进入
cd ..
cd NFT-Contract
```

## 常用操作

### 编译合约
```bash
# 确保在 NFT-Contract 目录下
cd /home/beat1ngheart/Custom_NFT/NFT-Contract
moccasin compile
```

### 运行前端
```bash
# 确保在 Website-React 目录下
cd /home/beat1ngheart/Custom_NFT/Website-React
npm run dev
```

### 快速切换
```bash
# 从任何位置到合约目录
cd /home/beat1ngheart/Custom_NFT/NFT-Contract

# 从任何位置到前端目录
cd /home/beat1ngheart/Custom_NFT/Website-React

# 从任何位置到项目根目录
cd /home/beat1ngheart/Custom_NFT
```

## 记忆技巧

- `..` = 上一级目录（父目录）
- `../NFT-Contract` = 从当前位置的上一级目录进入 NFT-Contract
- `NFT-Contract` 和 `Website-React` 是**同级目录**，都在 `Custom_NFT` 根目录下

