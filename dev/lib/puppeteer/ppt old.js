export { connect, xpage, mostRobustClick };
import puppeteer from "puppeteer-core";
import kit from "@ghini/kit";
async function connect(ws, headless = false) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: ws,
    defaultViewport: null,
    headless,
  });
  const pagesPromise = browser.pages();
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("获取pages超时")), 30000);
  });
  const pages = await Promise.race([pagesPromise, timeoutPromise]);
  return { browser, pages };
}
/*
page.$ querySelector
page.$$ querySelectorAll
page.$eval
page.$$eval
page.evaluate 可以操作浏览器js和返回浏览器js内容
page.evaluateHandle
page.evaluateOnNewDocument
*/

// page.$$eval()
// page.evaluate()
/**
 * @template T
 * @param {T} page
 * @returns {T & { go: Function,get: Function,iframe: any,click: Function,put: Function,smartput: Functionwaitdom: Function }}
 */
function xpage(page) {
  page.bringToFront();
  return Object.assign(page, {
    waitdom: async (selector) => {
      await page.waitForSelector(selector, { timeout: 90000 });
      return page.$(selector);
    },
    go: async (url, options = { waitUntil: "networkidle2" }) => {
      await page.goto(url, {
        ...{ waitUntil: "networkidle2", timeout: 0 },
        ...options,
      });
      return page.bringToFront();
    },
    get: async (selector) => {
      return page.waitForSelector(selector, { timeout: 30000 });
    },
    iframe,
    /** 拟人化点击目标 */
    click: async function (selector) {
      // 等待15s单选按钮加载,间隔500ms,同时尝试往下滚动页面
      let radioButton;
      if (typeof selector === "string") {
        radioButton = await this.waitdom(selector);
      } else radioButton = selector;
      await radioButton.scrollIntoView();
      // 获取单选按钮的位置和大小
      const boundingBox = await radioButton.boundingBox();
      // 计算点击位置 (稍微随机化以模拟人类点击)
      const x = boundingBox.x + boundingBox.width / 2 + (Math.random() * 6 - 3);
      const y =
        boundingBox.y + boundingBox.height / 2 + (Math.random() * 6 - 3);
      // 1. 先将鼠标移动到按钮附近 (人类通常不会直接精确点击)
      await page.mouse.move(
        x + (Math.random() * 30 - 15),
        y + (Math.random() * 30 - 15)
      );
      // 2. 短暂停顿，模拟人类定位目标的行为
      await kit.sleep(300 + Math.floor(Math.random() * 400));
      await page.mouse.move(x, y, { steps: 5 }); // steps参数使移动更自然
      await kit.sleep(200 + Math.floor(Math.random() * 300));
      await page.mouse.click(x, y);
    },
    xclick: async (selector) => {
      mostRobustClick(selector);
    },
    put: async (selector, value) => {
      let dom;
      if (typeof selector === "string") {
        if (!selector.startsWith("input")) {
          selector = `input[name="${selector}"]`;
        }
        dom = await page.get(selector);
      } else dom = selector;
      // console.log(dom);
      if (!dom) return;
      await dom.focus();
      await page.keyboard.down("Control"); // 按下 Ctrl 键
      await page.keyboard.press("a"); // 按下并释放 a 键
      await page.keyboard.up("Control"); // 释放 Ctrl 键
      await dom.type(value, { delay: kit.rint(20, 100) });
    },
    smartput: async (...argv) => {
      const inputs = await page.$$("input");
      let n = 0;
      for (const arg of argv) {
        await page.put(inputs[n], arg);
        n++;
      }
      await mostRobustClick(page);
    },
  });
}
async function iframe(frame_selector = "iframe") {
  const page = this;
  iframe = await (await page.get(frame_selector)).contentFrame();
  iframe.put = async (selector, value) => {
    if (!selector.startsWith("input")) {
      selector = `input[name="${selector}"]`;
    }
    await iframe.focus(selector);
    await page.keyboard.down("Control"); // 按下 Ctrl 键
    await page.keyboard.press("a"); // 按下并释放 a 键
    await page.keyboard.up("Control"); // 释放 Ctrl 键
    await iframe.type(selector, value, { delay: kit.rint(20, 120) });
  };
  iframe.submit = async (selector) => {
    if (!selector.startsWith("input")) {
      selector = `input[name="${selector}"]`;
    }
    await iframe.click(selector);
  };
  return iframe;
}

/**
 * @param {import('puppeteer-core').Page} page - Puppeteer页面对象
 * @param {string} [selector='button[type="submit"]'] - 要点击的元素选择器
 * @returns {Promise<void>}
 */
async function mostRobustClick(page, selector = 'button[type="submit"]', maxRetries = 1) {
  // 尝试点击多次以增加成功率
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // 等待元素存在并且可见
      await page.waitForSelector(selector, { 
        visible: true, 
        timeout: 5000 
      });
      
      // 获取当前鼠标位置
      const currentPosition = await page.evaluate(() => {
        return { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight };
      });
      
      // 随机滚动
      await page.mouse.wheel({ deltaY: Math.random() * 200 - 100 });
      await kit.sleep(page, Math.random() * 400 + 200);
      
      // 获取元素并确保它在视图中
      const element = await page.$(selector);
      if (!element) {
        console.log("Element not found, retrying...");
        continue;
      }
      
      // 检查元素是否真的可见和可点击
      const isVisible = await page.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 &&
               window.getComputedStyle(el).visibility !== 'hidden' &&
               window.getComputedStyle(el).display !== 'none' &&
               !el.disabled;
      }, element);
      
      if (!isVisible) {
        console.log("Element not visible or clickable, retrying...");
        continue;
      }
      
      // 平滑滚动到元素
      await element.scrollIntoView({ behavior: "smooth", block: "center" });
      await kit.sleep(page, Math.random() * 600 + 300);
      
      // 再次确认元素位置（滚动后可能发生变化）
      const box = await element.boundingBox();
      if (!box) {
        console.log("Could not get element boundaries, retrying...");
        continue;
      }
      
      // 确保点击区域在元素中心区域（避开边缘）
      const x = box.x + box.width * (0.4 + Math.random() * 0.2); // 40%-60%区域
      const y = box.y + box.height * (0.4 + Math.random() * 0.2);
      
      // 人性化移动
      await humanMoveToTarget(page, currentPosition.x, currentPosition.y, x, y);
      
      // 悬停一会儿
      await kit.sleep(page, Math.random() * 200 + 100);
      
      // 点击操作
      await page.mouse.down();
      await kit.sleep(page, Math.random() * 100 + 30);
      await page.mouse.up();
      
      // 验证点击是否成功（这部分需要根据具体场景调整）
      const clickSuccess = await validateClick(page, selector);
      if (clickSuccess) {
        return true; // 点击成功
      } else {
        console.log(`Click attempt ${attempt+1} failed, retrying...`);
      }
    } catch (error) {
      console.log(`Error in click attempt ${attempt+1}:`, error);
    }
    
    // 失败后等待一段时间再重试
    await kit.sleep(page, Math.random() * 1000 + 500);
  }
  
  return false; // 所有尝试都失败
}

// 人性化鼠标移动
async function humanMoveToTarget(page, x0, y0, x1, y1) {
  const distance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  const steps = Math.min(Math.max(Math.floor(distance / 10), 10), 30); // 步数基于距离但有上下限
  
  // 创建中间控制点（稍微偏离直线）
  const cpX = (x0 + x1) / 2 + (Math.random() * 0.4 - 0.2) * distance;
  const cpY = (y0 + y1) / 2 + (Math.random() * 0.4 - 0.2) * distance;
  
  // 使用二次贝塞尔曲线模拟人类移动
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // 调整时间函数使移动有加速和减速
    const timeFactor = -4 * t * t + 4 * t; // 平滑的加速减速曲线
    
    // 二次贝塞尔曲线计算
    const x = Math.pow(1-t, 2) * x0 + 2 * (1-t) * t * cpX + Math.pow(t, 2) * x1;
    const y = Math.pow(1-t, 2) * y0 + 2 * (1-t) * t * cpY + Math.pow(t, 2) * y1;
    
    await page.mouse.move(x, y);
    
    // 速度变化模拟人类行为
    const delay = Math.random() * 5 + 10 * (1 - timeFactor);
    await kit.sleep(page, delay);
  }
}

// 验证点击是否成功（需要根据具体场景实现）
async function validateClick(page, selector) {
  try {
    // 例如：检查元素是否消失、页面是否变化等
    // 这里只是一个示例，需要根据具体场景调整
    const elementExists = await page.$(selector);
    if (!elementExists) {
      return true; // 元素消失，可能表示点击成功
    }
    
    // 或者检查是否有新元素出现
    // const newElementAppeared = await page.$('新元素选择器');
    // if (newElementAppeared) return true;
    
    // 或者检查URL变化
    // const url = page.url();
    // if (url.includes('expected-path')) return true;
    
    return false; // 如果没有明确的成功迹象，返回失败
  } catch (error) {
    console.log("Error validating click:", error);
    return false;
  }
}