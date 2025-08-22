export {
  connect,
  pagesInfo,
  pageInfo,
  smartGetInputs,
  smartInput,
  smartInputs,
  smartSubmit,
  go,
  click,
  waitdom,
  waitdoms,
  iframe,
};
import puppeteer from "puppeteer-core";
import kit from "@ghini/kit";

/**
 * 通过选择器找目标iframe
 */
async function iframe(page, selector, timeout = 30000) {
  // let iframe = await bctl.waitdom(page, `iframe[title*="cons"i]`);
  let iframe = await waitdom(page, selector, timeout);
  if (iframe) {
    return iframe.contentFrame();
  }
  return null;
}
/**
 * 如果找不到，不会报错，而是返回 null。
 * @returns {Promise<ElementHandle|null>}
 */
async function waitdom(page, selector, timeout = 30000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return await page.$(selector);
  } catch (error) {
    // 只捕获 TimeoutError，如果是其他错误则说明有问题
    if (error.name === "TimeoutError") {
      return null; // 在超时后温柔地返回 null
    }
    throw error; // 抛出其他类型的错误
  }
}

/**
 * 如果找不到，不会报错，而是返回空数组 []。
 * @returns {Promise<ElementHandle[]>}
 */
async function waitdoms(page, selector, timeout = 30000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return await page.$$(selector);
  } catch (error) {
    if (error.name === "TimeoutError") {
      return []; // 在超时后温柔地返回空数组
    }
    throw error;
  }
}
async function click(page, selector, timeout = 90000) {
  // 等待15s单选按钮加载,间隔500ms,同时尝试往下滚动页面
  let radioButton;
  if (typeof selector === "string") {
    await page.waitForSelector(selector, { timeout });
    radioButton = await page.$(selector);
  } else radioButton = selector;
  await radioButton.scrollIntoView();
  // 获取单选按钮的位置和大小
  const boundingBox = await radioButton.boundingBox();
  // 计算点击位置 (稍微随机化以模拟人类点击)
  const x = boundingBox.x + boundingBox.width / 2 + (Math.random() * 6 - 3);
  const y = boundingBox.y + boundingBox.height / 2 + (Math.random() * 6 - 3);
  // 1. 先将鼠标移动到按钮附近 (人类通常不会直接精确点击)
  await page.mouse.move(
    x + (Math.random() * 30 - 15),
    y + (Math.random() * 30 - 15)
  );
  // 2. 短暂停顿，模拟人类定位目标的行为
  // await kit.sleep(300 + Math.floor(Math.random() * 400));
  await page.mouse.move(x, y, { steps: 5 }); // steps参数使移动更自然
  // await kit.sleep(200 + Math.floor(Math.random() * 300));
  await page.mouse.click(x, y);
}
/**
 * 通过启发式评分系统，智能地查找并点击页面上最合适的提交按钮。
 * @param {import('puppeteer').Page} page - Puppeteer 的 Page 对象。
 * @returns {Promise<boolean>} - 如果成功点击则返回 true，否则返回 false。
 */
async function smartSubmit(page) {
  // console.log(
  //   "SmartSubmit (v2.1 - Corrected): Starting intelligent submit button search..."
  // );
  // 1. Base Filter: Get all buttons of type="submit"
  const allSubmitButtons = await page.$$('[type="submit"]');
  if (allSubmitButtons.length === 0) {
    console.log(
      'SmartSubmit: No elements with [type="submit"] found on the page.'
    );
    return false;
  }
  // console.log(
  //   `SmartSubmit: Found ${allSubmitButtons.length} [type="submit"] button(s). Evaluating candidates...`
  // );

  // 2. Intelligent Scoring: Evaluate each button in the browser context
  const scoredCandidates = await Promise.all(
    allSubmitButtons.map(async (button) => {
      const properties = await page.evaluate((el) => {
        if (!el) return null;

        // Filter out invisible or disabled buttons
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (
          el.disabled ||
          style.display === "none" ||
          style.visibility === "hidden" ||
          style.opacity === "0" ||
          rect.width === 0 ||
          rect.height === 0
        ) {
          return null; // Immediately disqualify non-interactive buttons
        }

        return {
          text: (el.innerText || el.value || "").trim().toLowerCase(),
          className: el.className.toLowerCase(),
          id: el.id.toLowerCase(),
        };
      }, button);

      if (!properties) {
        return { score: -1, button }; // Mark as an invalid candidate
      }

      // --- Scoring Logic ---
      let score = 0;
      const { text, className, id } = properties;

      // a. Score based on text content (highest weight)
      const positiveKeywords = [
        "submit",
        "confirm",
        "save",
        "continue",
        "done",
        "login",
        "add",
        "create",
        "update",
        "提交",
        "确认",
        "保存",
        "下一步",
        "完成",
        "登录",
        "创建",
      ];
      const negativeKeywords = [
        "cancel",
        "back",
        "close",
        "previous",
        "取消",
        "返回",
        "关闭",
        "上一步",
      ];

      if (positiveKeywords.some((kw) => text.includes(kw))) {
        score += 20;
      }
      if (negativeKeywords.some((kw) => text.includes(kw))) {
        score -= 30; // Strongly penalize negative actions
      }

      // b. Score based on CSS class names
      if (className.includes("primary") || className.includes("submit")) {
        score += 10;
      }
      if (className.includes("secondary") || className.includes("cancel")) {
        score -= 10;
      }
      // Specific bonus for AWS UI conventions
      if (className.includes("variant-primary")) {
        score += 5;
      }

      // c. Score based on ID
      if (id.includes("submit") || id.includes("confirm")) {
        score += 10;
      }

      return { score, button, text };
    })
  );

  // Filter out invalid candidates and those with a negative score, then sort by score descending
  const validCandidates = scoredCandidates
    .filter((c) => c.score >= 0)
    .sort((a, b) => b.score - a.score);

  if (validCandidates.length === 0) {
    console.log(
      "SmartSubmit: No suitable submit buttons found after evaluation (all were invisible, disabled, or had negative scores)."
    );
    return false;
  }

  // 3.  Decision: Choose the highest-scoring button
  const bestCandidate = validCandidates[0];
  // console.log(
  //   `SmartSubmit: Decision complete. Best candidate scored ${bestCandidate.score} with text "${bestCandidate.text}". Preparing to click...`
  // );

  try {
    // ** THE FIX IS HERE **
    // Wait for a brief moment before clicking to ensure stability
    await new Promise((r) => setTimeout(r, 500));

    await bestCandidate.button.click();
    // console.log("SmartSubmit: Button successfully clicked!");
    return true;
  } catch (error) {
    console.error(
      `SmartSubmit: An error occurred while clicking the best candidate button: ${error.message}`
    );
    return false;
  }
}
/** 连接提供ws的浏览器实例 */
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
  // 获取每个页面的详细信息
  return [browser, pages];
}
async function pagesInfo(pages) {
  const pagesInfo = await Promise.all(
    pages.map(async (page, index) => {
      try {
        const title = await page.title();
        const url = page.url();
        return {
          index,
          page,
          title: title || "无标题",
          url: url || "about:blank",
        };
      } catch (error) {
        console.warn(`获取页面 ${index} 信息失败:`, error.message);
        return {
          index,
          page,
          title: "无法获取标题",
          url: "无法获取URL",
        };
      }
    })
  );
  return pagesInfo;
}
async function pageInfo(page) {
  try {
    const title = await page.title();
    const url = page.url();
    return {
      index,
      page,
      title: title || "无标题",
      url: url || "about:blank",
    };
  } catch (error) {
    console.warn(`获取页面 ${index} 信息失败:`, error.message);
    return {
      index,
      page,
      title: "无法获取标题",
      url: "无法获取URL",
    };
  }
}
/** 智能输入 */
async function smartInput(page, text, n = 0) {
  const els = await smartGetInputs(page);
  if (els.length > 0) {
    const el = els[n];
    await el.click({ clickCount: 3 }); // triple click = 全选
    // await page.keyboard.press("Backspace"); // 删除选中内容
    // 或者逐字符删除（更拟人）
    const value = await el.evaluate((el) => el.value);
    for (let i = 0; i < value.length; i++) {
      await page.keyboard.press("Backspace");
      await kit.sleep(kit.rint(10, 40));
    }
    // await el.type(text + "", { delay: 15 });
    for (const char of text) {
      await el.type(char); // 一次只输入一个字符
      await kit.sleep(kit.rint(20, 150));
    }
  }
}
/** 智能输入
 * @param {Array} texts
 */
async function smartInputs(page, texts) {
  const els = await smartGetInputs(page);
  if (els.length > 0 && texts.length > 0) {
    const loopCount = Math.min(els.length, texts.length);
    for (let i = 0; i < loopCount; i++) {
      const el = els[i];
      const textToType = texts[i];
      await el.click({ clickCount: 3 }); // triple click = 全选
      // await page.keyboard.press("Backspace"); // 删除选中内容
      // 或者逐字符删除（更拟人）
      const value = await el.evaluate((el) => el.value);
      for (let i = 0; i < value.length; i++) {
        await page.keyboard.press("Backspace");
        await kit.sleep(kit.rint(10, 40));
      }
      for (const char of textToType) {
        await el.type(char); // 一次只输入一个字符
        await kit.sleep(kit.rint(20, 150));
      }
    }
  } else {
    console.log("没有找到可输入的元素或没有提供要输入的文本。");
  }
}
/** 智能获取可输入的input textarea元素 */
async function smartGetInputs(page) {
  const allInputHandles = await page.$$("input, textarea");
  const effectiveInputHandles = [];
  // 2. 遍历句柄，逐个进行智能筛选
  for (const handle of allInputHandles) {
    const isEffective = await handle.evaluate((el) => {
      // 这段函数也将在浏览器环境中执行，但每次循环都会执行一次
      const textInputTypes = [
        "text",
        "password",
        "email",
        "search",
        "url",
        "tel",
        "number",
        "date",
        "month",
        "week",
        "time",
        "datetime-local",
        "color",
      ];
      const isEnabled = !el.disabled && !el.readOnly;
      const isTextInput =
        el.tagName.toLowerCase() === "textarea" ||
        (el.tagName.toLowerCase() === "input" &&
          textInputTypes.includes(el.type.toLowerCase()));
      const style = window.getComputedStyle(el);
      const isVisible =
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        el.offsetParent !== null;

      return isEnabled && isTextInput && isVisible;
    });
    if (isEffective) {
      effectiveInputHandles.push(handle);
    }
  }
  // console.log(
  //   `页面上有效且可输入的元素数量为: ${effectiveInputHandles.length}`
  // );
  return effectiveInputHandles;
}

async function go(page, url) {
  await page.goto(url, {
    waitUntil: "domcontentloaded", // 比 networkidle 快得多
    timeout: 120000, // 将超时时间增加到 120 秒
    // waitUntil: "networkidle2", // 等待网络空闲时，表示页面加载完成
  });
}
