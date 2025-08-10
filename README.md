# 一个Ghini简单标准（不使用ts）的npm库开始结构

## dev纯js开发环境
## dist（转化为支持ts的环境(简单标准没有ts)）起个备份作用
## private私有测试
## test公开测试

## build.js用来修改version和打包

## 全屏替换xstart为新库名
```
Remove-Item -Recurse -Force .git
git init
git add .
git commit -m "Initial commit"
git branch -M xstart
git remote add origin https://github.com/xghini/mynpm.git
git push -u origin xstart
npm run pub
```