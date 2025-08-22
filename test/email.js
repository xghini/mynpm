// 监听邮箱验证码
import kit from "@ghini/kit";
import bctl, { bit } from "@ghini/bctl/dev";

let a1, a2, a3, res;
res = await bit.fastopen("email");
// console.log(res);
const { browser, pages } = res[0].puppeteer;
console.log(pages);
let page = pages.filter((v) =>
  v.url.startsWith("https://mail.google.com/mail/u/0/#inbox")
)[0].page;
// page.on("request", async (request) => {
//   // 为了让输出更清晰，我们用分隔线隔开每个请求
//   console.log("----------------");
//   console.log(`请求URL: ${request.url()}`);
//   console.log(`类型: ${request.resourceType()} 方法: ${request.method()}`);
//   // console.log(request.headers());
//   // if (request.method() === "POST") {
//   //   console.log(`Post Data: ${request.postData() || "无"}`);
//   // }
//   // console.log(`是否为导航请求: ${request.isNavigationRequest()}`);
//   console.log("----------------\n");
// });

// 对于您当前“监听并从响应中获取数据”这个目标来说，只使用 response 事件监听器是完全正确且更高效的策略。request 监听器确实可以完全放弃。response事件的回调函数中我们可以通过response.request() 方法拿到与之对应的那个 request 对象
page.on("response", async (response) => {
  const request = response.request();
  let body;
  try {
    body = await response.text();
  } catch (error) {
    // console.error(request.resourceType(),error);
  }
  const res = {
    url: request.url(),
    method: request.method(),
    headers: request.headers(),
    postData: request.postData(),
    resourceType: request.resourceType(),
    isNavigationRequest: request.isNavigationRequest(),
    status: response.status(),
    body,
  };
  delete res.postData;
  delete res.headers;
  // console.log(res);
  // 只关注核心的API请求
  if (res.resourceType === "xhr" || res.resourceType === "fetch") {
    console.log(res);
  }
});
