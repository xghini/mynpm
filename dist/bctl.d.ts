export declare const bctl: {
    create: typeof create;
    list: typeof list;
    open: typeof open;
    close: typeof close;
    del: typeof del;
    delname: typeof delname;
    delgroup: typeof delgroup;
    delopt: typeof delopt;
    delall: typeof delall;
    fastopen: typeof fastopen;
    fastclose: typeof fastclose;
};
import type { Browser, Page, BrowserContext } from 'playwright';
export interface BrowserProfile {
    id: string;
    name: string;
    groupName?: string;
    groupId?: string | null;
    status?: number;
    seq?: number;
    remark?: string;
    [key: string]: any;
}
/**
 * 比特浏览器创建配置项,所有字段均为可选，未传则使用函数内部默认值
 */
export interface CreateProfile {
    groupId?: string | null;
    name?: string;
    remark?: string;
    proxyMethod?: number;
    proxyType?: 'noproxy' | 'http' | 'https' | 'socks5' | 'ssh';
    browserFingerPrint?: Record<string, any>;
    host?: string;
    port?: string;
    proxyUserName?: string;
    proxyPassword?: string;
    password?: string;
    abortImageMaxSize?: number;
    abortMedia?: boolean;
    muteAudio?: boolean;
    credentialsEnableService?: boolean;
    [key: string]: any;
}
interface OpenResult {
    id: string;
    ws: string;
    browser: Browser;
    page0: Page;
    context: BrowserContext;
    [key: string]: any;
}
interface FilterOptions {
    groupId?: string;
    groupName?: string;
    name?: string;
    status?: number;
    [key: string]: any;
}
/**
 * 批量筛选打开,如果用字符串默认找name，空默认所有
 */
declare function fastopen(filter?: string | FilterOptions): Promise<OpenResult[]>;
/**
 * 批量筛选关闭
 */
declare function fastclose(filter?: FilterOptions): Promise<any[]>;
/**
 * 根据选项删除浏览器配置
 */
declare function delopt(option?: FilterOptions): Promise<any>;
/**
 * 根据分组名称，删除该分组下的所有浏览器配置文件。
 */
declare function delgroup(groupName: string): Promise<any>;
/**
 * 根据窗口名称的模糊匹配，删除所有匹配的浏览器配置文件。
 */
declare function delname(name: string): Promise<any>;
/**
 * 最原始的自定义创建
 * @returns 浏览器id
 */
declare function create(options?: CreateProfile): Promise<string>;
/**
 * API会自动检查id状态,选择打开或直接连接,返回含ws, playwright browser/page 的对象
 * 这是改动最大的部分
 */
declare function open(id: string | BrowserProfile): Promise<OpenResult>;
/**
 * 获取所有浏览器配置文件
 */
declare function list(filterOptions?: FilterOptions): Promise<BrowserProfile[]>;
declare function close(id: string): Promise<any>;
declare function del(ids: string[]): Promise<any>;
declare function delall(): Promise<any>;
export {};
//# sourceMappingURL=bctl.d.ts.map