# 一个标准JS（兼容ts）的npm库开始结构

## build.js用来修改version和打包

## 全文件替换xstart为新库名
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