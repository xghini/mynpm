// build.js - 一个完整的构建脚本，无需外部依赖

// 1. 导入 Node.js 内置模块
import fs from 'fs';
import path from 'path';

// --- 配置 ---
const devDir = './dev';
const distDir = './dist';
const packageJsonPath = './package.json';

// --- 辅助函数 ---

/**
 * 递归地复制一个目录及其所有内容。
 * @param {string} src 源目录路径。
 * @param {string} dest 目标目录路径。
 */
function copyDirRecursive(src, dest) {
  const exists = fs.existsSync(src);
  if (!exists) {
    console.error(`错误：源目录 "${src}" 不存在。`);
    throw new Error(`源目录 ${src} 未找到。`);
  }

  const stats = fs.statSync(src);
  const isDirectory = stats.isDirectory();

  if (isDirectory) {
    // 如果是目录，创建目标目录
    fs.mkdirSync(dest, { recursive: true });
    // 读取源目录中的所有项，并对每一项进行递归调用
    fs.readdirSync(src).forEach(childItemName => {
      copyDirRecursive(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    // 如果是文件，直接复制
    fs.copyFileSync(src, dest);
  }
}

/**
 * 根据当前日期生成版本号。
 * 格式：年.月.日时分秒 (例如: 25.7.3111405)
 * @returns {string} 新的版本号。
 */
function generateVersionFromDate() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // 获取年份后两位
  const month = (now.getMonth() + 1).toString();      // 月份(1-12)
  const day = now.getDate().toString();              // 日(1-31)
  const hours = now.getHours().toString().padStart(2, '0');   // 小时(00-23)
  const minutes = now.getMinutes().toString().padStart(2, '0'); // 分钟(00-59)
  const seconds = now.getSeconds().toString().padStart(2, '0'); // 秒(00-59)
  return `${year}.${month}.${day}${hours}${minutes}${seconds}`;
}


// --- 主要构建流程 ---

try {
  console.log('🚀 开始执行构建流程...');

  // 步骤 1: 清理旧的 'dist' 目录
  if (fs.existsSync(distDir)) {
    console.log(`[1/3] 正在删除旧目录: ${distDir}`);
    // fs.rmSync 是一个现代且高效的递归删除目录的方法
    fs.rmSync(distDir, { recursive: true, force: true });
  }

  // 步骤 2: 将 'dev' 目录复制为 'dist'
  console.log(`[2/3] 正在复制 "${devDir}" 到 "${distDir}"...`);
  copyDirRecursive(devDir, distDir);
  console.log('...目录复制完成。');

  // 步骤 3: 更新 package.json 中的版本号
  console.log(`[3/3] 正在更新 ${packageJsonPath} 中的版本号...`);
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);
  
  const oldVersion = packageJson.version;
  const newVersion = generateVersionFromDate();
  packageJson.version = newVersion;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`...版本号已从 ${oldVersion} 更新为 ${newVersion}。`);

  console.log('\n✅ 构建流程成功完成！');

} catch (error) {
  console.error('\n❌ 构建流程失败:');
  console.error(error.message);
  // 以错误码退出，表示构建失败
  process.exit(1);
}
