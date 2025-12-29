// build.js
import fs from 'fs';
import { execSync } from 'child_process';
const devDir = './dev';
const distDir = './dist';
const packageJsonPath = './package.json';

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

  // 步骤 1: 清理旧的 'dist' 和 'dev' 目录
  if (fs.existsSync(distDir)) {
    console.log(`[1/3] 正在删除旧目录: ${distDir}`);
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  if (fs.existsSync(devDir)) {
    console.log(`[1/3] 正在删除旧目录: ${devDir}`);
    fs.rmSync(devDir, { recursive: true, force: true });
  }

  // 步骤 2: 运行 TypeScript 编译
  console.log(`[2/3] 正在编译 TypeScript...`);
  execSync('npx tsc', { stdio: 'inherit' });
  console.log('...TypeScript 编译完成。');

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
