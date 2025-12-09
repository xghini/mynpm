# 一个标准 TypeScript 2025 的 npm 库脚手架

## 🎯 特性

- ✅ **TypeScript 5.7+** - 使用最新的 TypeScript 配置
- ✅ **严格类型检查** - 启用 `strict` 模式，确保类型安全
- ✅ **现代 ESM** - 原生 ES Module 支持
- ✅ **自动类型生成** - 自动生成 `.d.ts` 类型声明文件
- ✅ **Source Map** - 完整的源码映射支持

## 📁 目录结构

```
src/          # TypeScript 源码
├── main.ts
└── lib/
    ├── index.ts
    └── start.ts

dist/         # 编译产物（发布到 npm）
├── main.js
├── main.d.ts
└── lib/...

dev/          # 开发测试副本（与 dist 相同）
```

## 🚀 使用方法

### 开发
```bash
npm run type-check  # 类型检查（不生成文件）
npm run build       # 编译 TypeScript + 打包 + 更新版本号
```

### 发布
```bash
npm run pub         # 构建 + 发布到 npm + 提交 git
```

## 🔧 TypeScript 配置亮点

- `moduleResolution: "bundler"` - 2025 最新模块解析策略
- `verbatimModuleSyntax: true` - 严格 ESM 语法
- `strict: true` - 全部严格类型检查
- `declaration: true` - 自动生成类型声明

## 📦 创建新库

全文件替换 `xstart` 为新库名：
```bash
Remove-Item -Recurse -Force .git
git init
git add .
git commit -m "Initial commit"
git branch -M xstart
git remote add origin git@github.com:xghini/mynpm.git
git push -u origin xstart
npm run pub
```