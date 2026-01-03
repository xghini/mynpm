// src/bitpw.ts
// 项目文件第一行注释文件路径
export const bctl = {
    // 创建
    create,
    // 查询
    list,
    // 打开/连接
    open,
    // 关闭
    close,
    // 删除
    del,
    delname,
    delgroup,
    delopt,
    delall,
    // 高级封装
    fastopen,
    fastclose,
};
import kit from '@ghini/kit';
// 引入上一节我们重构的 playwright 连接器
import { playwright } from './playwright.js';
// 不限制请求并发数,但每个之间间隔1.1s
const queue = kit.queue(1024, { minInterval: 1100 });
/**
 * 批量筛选打开,如果用字符串默认找name，空默认所有
 */
async function fastopen(filter) {
    let filterObj = {};
    if (typeof filter === 'string') {
        filterObj = { name: filter };
    }
    else if (filter) {
        filterObj = filter;
    }
    // 按 seq 排序逻辑保留
    let res = (await list(filterObj)).sort((a, b) => (a.seq || 0) - (b.seq || 0));
    console.log(`fastopen:`, res.length);
    // Playwright 的并发连接非常稳定，通常不需要 queue
    // 如果比特浏览器本地 API 报错，可考虑加回 queue 或 p-limit
    const results = await Promise.all(res.map(v => queue(() => open(v.id).catch(e => console.error(`[Skip] ${v.id} 启动失败: ${e.message}`)))));
    return results.filter((item) => item != null);
}
/**
 * 批量筛选关闭
 */
async function fastclose(filter = {}) {
    const res = await list(filter);
    const results = await Promise.all(res.map(v => close(v.id)));
    return results;
}
/**
 * 根据选项删除浏览器配置
 */
async function delopt(option = {}) {
    try {
        const allProfiles = await list(option);
        if (allProfiles.length === 0) {
            console.warn(`警告：目标option无任何窗口。`);
            return;
        }
        const idsToDelete = allProfiles.map(p => p.id);
        const result = await del(idsToDelete);
        console.log(`找到 ${idsToDelete.length} 个窗口，执行删除...`, result);
        return result;
    }
    catch (error) {
        console.error(`delopt发生错误:`, error);
        throw error;
    }
}
/**
 * 根据分组名称，删除该分组下的所有浏览器配置文件。
 */
async function delgroup(groupName) {
    if (!groupName) {
        console.error('错误：必须提供要删除的分组名称 (groupName)。');
        return;
    }
    try {
        const allProfiles = await list();
        const profilesInGroup = allProfiles.filter(p => p.groupName === groupName);
        if (profilesInGroup.length === 0) {
            console.warn(`警告：找不到名为 "${groupName}" 的分组，或该分组下无任何窗口。`);
            return 0;
        }
        const idsToDelete = profilesInGroup.map(p => p.id);
        const result = await del(idsToDelete);
        console.log(`在分组 "${groupName}" 中找到 ${idsToDelete.length} 个窗口，执行删除...`, result);
        return result;
    }
    catch (error) {
        console.error(`删除分组 "${groupName}" 过程中发生错误:`, error);
        throw error;
    }
}
/**
 * 根据窗口名称的模糊匹配，删除所有匹配的浏览器配置文件。
 */
async function delname(name) {
    if (!name) {
        console.error('错误：必须提供要删除的窗口名称 (name)。');
        return;
    }
    console.log(`准备删除名称中包含 "${name}" 的所有窗口...`);
    try {
        const allProfiles = await list();
        const profilesToDel = allProfiles.filter(p => p.name.includes(name));
        if (profilesToDel.length === 0) {
            console.warn(`警告：找不到名称中包含 "${name}" 的窗口。`);
            return;
        }
        const idsToDelete = profilesToDel.map(p => p.id);
        console.log(`找到 ${idsToDelete.length} 个名称匹配的窗口，执行删除...`);
        const result = await del(idsToDelete);
        console.log(`名称匹配的窗口已删除。API响应:`, result);
        return result;
    }
    catch (error) {
        console.error(`删除名称为 "${name}" 的窗口过程中发生错误:`, error);
        throw error;
    }
}
/**
 * 最原始的自定义创建
 * @returns 浏览器id
 */
async function create(options = {}) {
    const json = {
        ...{
            groupId: null,
            name: '',
            remark: 'API创建',
            proxyMethod: 2,
            proxyType: 'noproxy',
            browserFingerPrint: {
                ostype: 'PC',
                os: 'MacIntel',
            },
            host: '',
            port: '',
            proxyUserName: '',
            proxyPassword: '',
            abortImageMaxSize: 10,
            abortMedia: true,
            muteAudio: true,
            credentialsEnableService: true,
        },
        ...options,
    };
    const res = await kit.req('http://127.0.0.1:54345/browser/update post', {
        json,
    });
    if (!res.data || !res.data.success) {
        console.error('比特浏览器创建失败:', res.data ? res.data.msg : '无响应');
        throw new Error(res.data ? res.data.msg : '比特浏览器API无响应');
    }
    console.log(`比特浏览器创建成功`, json.name);
    return res.data.data.id;
}
/**
 * API会自动检查id状态,选择打开或直接连接,返回含ws, playwright browser/page 的对象
 * 这是改动最大的部分
 */
async function open(id) {
    const browserId = typeof id === 'object' ? id.id : id;
    // 调用比特浏览器 API 打开窗口
    let res = await kit.req('http://127.0.0.1:54345/browser/open post', {
        json: {
            id: browserId,
            args: [], // 你的自定义 args
            loadExtensions: false,
            extractIp: false,
        },
    });
    if (!res.data.data) {
        console.error(res.data);
        throw new Error('打开浏览器失败');
    }
    // 比特浏览器 API 返回的数据
    const apiData = res.data.data;
    try {
        // 连接 WebSocket
        const { browser, context, page0 } = await playwright.connect(apiData.ws);
        // 构造返回对象
        return {
            ...apiData, // 包含 id, ws, http 等原有字段
            browser, // Playwright Browser 实例
            page0, // Playwright Page 实例 (默认第一页)
            context,
        };
    }
    catch (error) {
        // 如果 WS 连接失败，必须通知指纹浏览器关闭该窗口，否则会残留僵尸进程
        await kit
            .req('http://127.0.0.1:54345/browser/close post', {
            json: { id: browserId },
        })
            .catch(() => { });
        throw error; // 继续向上抛出
    }
}
/**
 * 获取所有浏览器配置文件
 */
async function list(filterOptions = {}) {
    let allProfiles = [];
    let currentPage = 0;
    const pageSize = 100;
    while (true) {
        try {
            const res = await kit.req('http://127.0.0.1:54345/browser/list/concise post', {
                json: {
                    page: currentPage,
                    pageSize: pageSize,
                },
            });
            if (res.data && res.data.success && res.data.data && res.data.data.list) {
                const profilesOnPage = res.data.data.list;
                if (profilesOnPage.length === 0)
                    break;
                allProfiles.push(...profilesOnPage);
                if (profilesOnPage.length < pageSize)
                    break;
                currentPage++;
            }
            else {
                console.error('获取浏览器列表失败:', res.data ? res.data.msg : '无有效响应');
                throw new Error(res.data ? res.data.msg : 'API请求失败');
            }
        }
        catch (error) {
            console.error(`在获取第 ${currentPage} 页数据时发生网络错误:`, error);
            throw error;
        }
    }
    if (filterOptions && Object.keys(filterOptions).length > 0) {
        allProfiles = allProfiles.filter(item => {
            for (const key in filterOptions) {
                if (item[key] != filterOptions[key])
                    return false;
            }
            return true;
        });
    }
    return allProfiles;
}
async function close(id) {
    const res = await kit.req('http://127.0.0.1:54345/browser/close post', {
        json: { id },
    });
    return res.data;
}
async function del(ids) {
    const res = await kit.req('http://127.0.0.1:54345/browser/delete/ids post', {
        json: { ids },
    });
    return res.data;
}
async function delall() {
    const ids = (await list()).map(v => v.id);
    const res = await kit.req('http://127.0.0.1:54345/browser/delete/ids post', {
        json: { ids },
    });
    return res.data;
}
//# sourceMappingURL=bctl.js.map