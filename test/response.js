// 通过response来读取gmail新收件内容的示例
import kit from "@ghini/kit";
import bctl, { bit } from "@ghini/bctl/dev";
kit.gcatch();

const [ebrowser, epages] = (await bit.fastopen("email"))[0].puppeteer;
// console.log(epages);
const epage0 = (await bctl.pagesInfo(epages)).filter((v) =>
  v.url.startsWith("https://mail.google.com/mail/u/0/#inbox")
)[0].page;
// 对于您当前“监听并从响应中获取数据”这个目标来说，只使用 response 事件监听器是完全正确且更高效的策略。request 监听器确实可以完全放弃。response事件的回调函数中我们可以通过response.request() 方法拿到与之对应的那个 request 对象
epage0.on("response", async (response) => {
  const request = response.request();
  let body, data;
  try {
    body = await response.text();
    data = JSON.parse(body);
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
    data,
  };
  delete res.postData;
  delete res.headers;
  // console.log(res);
  // 只关注核心的API请求
  if (res.resourceType !== "xhr" && res.resourceType !== "fetch") return;
  if (res.url.match(/sync\/u\/\d+\/i\/fd/)) {
    // console.log(res.data);
    // console.log(res.data[1]);
    // gmail的有效数据在这
    console.log(res.data[1][0][2][0][1]);
    let receive = res.data[1][0][2][0][1][0][0][1],
      subject = res.data[1][0][2][0][1][4],
      content = res.data[1][0][2][0][1][6],
      send = res.data[1][0][2][0][1][7],
      stamp = res.data[1][0][2][0][1][16],
      lang = res.data[1][0][2][0][1][29][0];
    console.log(`收件人:`, receive); //arr
    console.log(`主题:`, subject);
    console.log(`内容:`, content);
    console.log(`发件人:`, send);
    console.log(`时间戳:`, stamp);
    console.log(`语言:`, lang);
    // console.log(res.body.match(/"[^@"]{6,}@gmail\.com"/)[0]);
    // regarr.map((v, i) => {
    //   if (v[0] === receive) {
    //     const code = content.match(/ (\d{6}) /);
    //     if (code) {
    //       console.log(code[0], code[1], v[0]);
    //       v[1] = code[1];
    //     }
    //   }
    // });
  }
});