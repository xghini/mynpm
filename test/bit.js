import kit from "@ghini/kit";
import bctl, { bit } from "@ghini/bctl/dev";

let a1, a2, a3, res;
res = await bit.fastopen("email");
// console.log(res);
const { browser, pages } = res[0].puppeteer;
console.log(pages);
let page=pages.filter(v=>v.url.startsWith("https://mail.google.com/mail/u/0/#inbox"))[0].page


// 监听新邮件的简单函数
async function monitorNewEmails(page) {
  console.log('开始监听新邮件...');
  
  // 获取当前邮件数量
  let currentEmailCount = 0;
  try {
    await page.waitForSelector('[data-thread-id]', { timeout: 5000 });
    const emails = await page.$$('[data-thread-id]');
    currentEmailCount = emails.length;
    console.log(`当前邮件数量: ${currentEmailCount}`);
  } catch (error) {
    console.log('无法获取邮件列表，继续监听...');
  }
  
  // 每3秒检查一次是否有新邮件
  setInterval(async () => {
    try {
      // 刷新邮件列表
      await page.keyboard.press('r');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 检查邮件数量
      const emails = await page.$$('[data-thread-id]');
      const newEmailCount = emails.length;
      
      if (newEmailCount > currentEmailCount) {
        console.log(`🔔 发现新邮件！数量从 ${currentEmailCount} 增加到 ${newEmailCount}`);
        
        // 获取新邮件信息
        const newEmails = emails.slice(0, newEmailCount - currentEmailCount);
        
        for (let i = 0; i < newEmails.length; i++) {
          const emailInfo = await getEmailInfo(page, newEmails[i]);
          console.log('📧 新邮件信息:', emailInfo);
        }
        
        currentEmailCount = newEmailCount;
      }
      
    } catch (error) {
      console.warn('检查新邮件时出错:', error.message);
    }
  }, 3000);
}

// 获取邮件基本信息
async function getEmailInfo(page, emailElement) {
  try {
    // 点击邮件打开
    await emailElement.click();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 获取邮件信息
    const emailInfo = await page.evaluate(() => {
      const info = {};
      
      // 获取标题
      const titleElement = document.querySelector('[data-legacy-thread-id] h2, .hP, .bog');
      info.title = titleElement ? titleElement.innerText.trim() : '无标题';
      
      // 获取发件人
      const senderElement = document.querySelector('[email], .go span[email]');
      info.sender = senderElement ? senderElement.getAttribute('email') : '未知发件人';
      
      // 获取收件人（当前登录用户）
      const recipientElement = document.querySelector('.hb .qu span');
      info.recipient = recipientElement ? recipientElement.innerText.trim() : '当前用户';
      
      // 获取时间
      const timeElement = document.querySelector('.g3 span[title]');
      info.time = timeElement ? timeElement.getAttribute('title') : '未知时间';
      
      // 获取邮件内容（前200字符）
      const contentElement = document.querySelector('.ii.gt, .gmail_default');
      info.content = contentElement ? 
        contentElement.innerText.trim().substring(0, 200) + '...' : 
        '无内容';
      
      return info;
    });
    
    // 返回邮件列表
    await page.goBack();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return emailInfo;
    
  } catch (error) {
    console.warn('获取邮件信息失败:', error.message);
    
    // 确保返回邮件列表
    try {
      await page.goBack();
    } catch (e) {
      // 忽略
    }
    
    return {
      title: '获取失败',
      sender: '未知',
      recipient: '未知', 
      time: '未知',
      content: '无法获取内容'
    };
  }
}

// 使用方法
monitorNewEmails(page);



















// const aws_create = bit.createFactory({
//   groupId: "4028808d9888d01c019895f26a940503",
//   proxyType: "socks5",
// });
// await aws_create("192.168.0.100:50001");
// await aws_create("192.168.0.100:50002");
// await aws_create("192.168.0.100:50003");
// await aws_create("192.168.0.100:50004");
// await aws_create("192.168.0.100:50005");
// await aws_create("192.168.0.100:50006");
// a1 = await bit.list({
//   groupName: "aws",
// });
// console.log(a1);

// res=await bit.fastopen({groupName:"aws"});
// console.log(res);
// res=await bit.fastclose({groupName:"aws"});
// console.log(res);
// process.exit();

// res = await Promise.all(a1.map((v) => run(() => bit.open(v.id))));
// console.log(res);

// 关闭aws开着的窗口
// a1 = a1.filter((v) => v.groupName == "aws" && v.status == 1);
// console.log(a1);
// a1.map((v) => bit.close(v.id));
// 删除aws组的所有窗口
// await bit.delgroup("aws");
// a1 = await bit.delname("192.168.0.100:50001");
// console.log(a1);
