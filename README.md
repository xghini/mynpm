# 一个Ghini简单标准（不使用ts）的npm库开始结构

## dev纯js开发环境
## dist（转化为支持ts的环境(简单标准没有ts)）起个备份作用
## private私有测试
## test公开测试

## build.js用来修改version和打包

## 记得改包名
```
git init
git branch -M new_branch
git remote add origin https://github.com/xghini/mynpm.git
git push -u origin new_branch
```