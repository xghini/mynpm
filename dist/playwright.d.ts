import { type Browser, type Page, type BrowserContext } from 'playwright';
export declare const playwright: {
    connect: typeof connect;
};
/** * 连接提供 ws 的指纹浏览器实例
 * 对应原来的 connect
 */
export declare function connect(ws: string): Promise<{
    browser: Browser;
    context: BrowserContext;
    page0: Page;
}>;
/**
 * 验证当前 Page 的网络/代理通畅性
 * @param page Playwright Page 对象
 * @param testUrl 测试目标 (默认 Google robots.txt，极小且无 JS)
 */
export declare function verifyNetwork(page: Page, testUrl?: string): Promise<void>;
//# sourceMappingURL=playwright.d.ts.map