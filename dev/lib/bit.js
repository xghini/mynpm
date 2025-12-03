export {
  // 创建
  create,
  createFactory,
  createByProxy,
  // 查询
  list,
  detail, //暂时没啥用
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
import kit from "@ghini/kit";
import { connect } from "./puppeteer/puppeteer.js";

/**
 * 批量筛选打开,如果用字符串默认找name，空默认所有
 * @param {*} filter
 * @returns
 */
async function fastopen(filter, minInterval = 110) {
  if (typeof filter === "string") {
    filter = { name: filter };
  }
  let res = (await list(filter)).sort((a, b) => a.seq - b.seq);
  console.log(`fastopen:`, res.length);
  const run = kit.queue(10, { minInterval });
  res = await Promise.all(res.map((v) => run(() => open(v.id))));
  return res;
}
/**
 * 批量筛选关闭
 * @param {*} filter
 * @returns
 */
async function fastclose(filter = {}) {
  // filter.status = 1;
  let res = await list(filter);
  res = await Promise.all(res.map((v) => close(v.id)));
  return res;
}
/**
 *
 * @param {object} option - 要清空的目标分组的名称，例如 "aws"。
 * @returns {Promise<object|undefined>} 返回API的删除操作响应，如果分组不存在则返回undefined。
 */
async function delopt(option = {}) {
  try {
    const allProfiles = await list(option);
    if (allProfiles.length === 0) {
      console.warn(`警告：目标option无任何窗口。`);
      return;
    }
    const idsToDelete = allProfiles.map((p) => p.id);
    const result = await del(idsToDelete);
    console.log(`找到 ${idsToDelete.length} 个窗口，执行删除...`, result);
    return result;
  } catch (error) {
    console.error(`delopt发生错误:`, error);
    throw error;
  }
}
/**
 * 根据分组名称，删除该分组下的所有浏览器配置文件。
 * @param {string} groupName - 要清空的目标分组的名称，例如 "aws"。
 * @returns {Promise<object|undefined>} 返回API的删除操作响应，如果分组不存在则返回undefined。
 */
async function delgroup(groupName) {
  if (!groupName) {
    console.error("错误：必须提供要删除的分组名称 (groupName)。");
    return;
  }
  try {
    const allProfiles = await list();
    const profilesInGroup = allProfiles.filter(
      (p) => p.groupName === groupName
    );
    if (profilesInGroup.length === 0) {
      console.warn(
        `警告：找不到名为 "${groupName}" 的分组，或该分组下无任何窗口。`
      );
      return 0;
    }
    const idsToDelete = profilesInGroup.map((p) => p.id);
    const result = await del(idsToDelete);
    console.log(
      `在分组 "${groupName}" 中找到 ${idsToDelete.length} 个窗口，执行删除...`,
      result
    );
    return result;
  } catch (error) {
    console.error(`删除分组 "${groupName}" 过程中发生错误:`, error);
    throw error;
  }
}
/**
 * 根据窗口名称的模糊匹配，删除所有匹配的浏览器配置文件。
 * @param {string} name - 要匹配的窗口名称的子字符串。
 * @returns {Promise<object|undefined>} 返回API的删除操作响应，如果无匹配窗口则返回undefined。
 */
async function delname(name) {
  if (!name) {
    console.error("错误：必须提供要删除的窗口名称 (name)。");
    return;
  }
  console.log(`准备删除名称中包含 "${name}" 的所有窗口...`);
  try {
    const allProfiles = await list();
    const profilesToDel = allProfiles.filter((p) => p.name.includes(name));
    if (profilesToDel.length === 0) {
      console.warn(`警告：找不到名称中包含 "${name}" 的窗口。`);
      return;
    }
    const idsToDelete = profilesToDel.map((p) => p.id);
    console.log(`找到 ${idsToDelete.length} 个名称匹配的窗口，执行删除...`);
    const result = await del(idsToDelete);
    console.log(`名称匹配的窗口已删除。API响应:`, result);
    return result;
  } catch (error) {
    console.error(`删除名称为 "${name}" 的窗口过程中发生错误:`, error);
    throw error;
  }
}

/**
 * 最原始的自定义创建
 */
async function create(options = {}) {
  const json = {
    ...{
      groupId: null, // 分组ID，不指定的话，会默认归属到账号的默认API分组
      name: "", // 窗口名称
      remark: "API创建", // 备注
      proxyMethod: 2, // 代理类型，2自定义代理，3提取IP
      proxyType: "noproxy", // 自定义代理类型 ['noproxy', 'http', 'https', 'socks5', 'ssh']
      browserFingerPrint: {},
      host: "", // 代理主机
      port: "", // 代理端口
      proxyUserName: "", // 代理账号
      proxyPassword: "", // 代理密码
      // 省流量设置
      abortImageMaxSize: 10, // 图片最大尺寸，超过则中断加载
      abortMedia: true,
      muteAudio: true,
      credentialsEnableService: true, // 不保存密码弹窗
    },
    ...options,
  };
  const res = await kit.req("http://127.0.0.1:54345/browser/update post", {
    json,
  });
  if (!res.data || !res.data.success) {
    console.error("比特浏览器创建失败:", res.data ? res.data.msg : "无响应");
    throw new Error(res.data ? res.data.msg : "比特浏览器API无响应");
  }
  console.log(`比特浏览器创建成功`, json.name);
  return res.data.data.id;
}
/**
 * [工厂函数 - 代理专用版] 根据一个模板代理字符串，创建一个可以自动递增 Session ID 的配置文件创建器。
 * @param {string} baseProxyString - 格式为 'host:port:username_base_XXXX:password' 的代理字符串。
 * @param {object} baseConfig - (可选) 用于此类配置的固定参数 (例如: { groupId, proxyType: 'http' })。
 * @returns {function(object): Promise<string>|null} 一个可以创建下一个配置文件的【新函数】，如果初始化失败则返回 null。
 */
function createByProxy(baseProxyString, baseConfig = {}) {
  // 1. 解析初始代理字符串，提取模板和计数器
  const parts = baseProxyString.split(":");
  if (parts.length !== 4) {
    console.error("代理字符串格式无效，应为 'host:port:username:password'");
    return null;
  }

  const [host, port, username, password] = parts;
  const lastUnderscoreIndex = username.lastIndexOf("_");

  if (lastUnderscoreIndex === -1) {
    console.error("代理用户名格式无效，找不到用于递增的 '_XXXX' 部分");
    return null;
  }

  const usernameBase = username.substring(0, lastUnderscoreIndex + 1); // e.g., "customer-...-sessid-1755831767_"
  let currentCounter = parseInt(
    username.substring(lastUnderscoreIndex + 1),
    10
  );

  if (isNaN(currentCounter)) {
    console.error("代理用户名中的 Session ID 不是一个有效的数字");
    return null;
  }

  /**
   * 这是工厂函数返回的专用函数。
   * 它负责自动生成下一个代理配置并调用 create 函数。
   * @param {object} options - (可选) 额外的或需要覆盖的配置项，例如 { name, remark }。
   */
  return async function createNextProfile(options = {}) {
    // a. 生成当前的代理用户名
    const currentUsername = `${usernameBase}${currentCounter}`;

    // b. 为下一次调用准备计数器
    currentCounter++;

    // c. 构建最终的配置对象
    const finalConfig = {
      // 基础配置 (来自工厂函数)
      proxyMethod: 2, // 强制为自定义代理
      proxyType: "http", // 默认为 http，因为这类代理很常见
      ...baseConfig, // 用户传入的固定配置 (如 groupId)

      // 根据本次调用动态生成的代理信息
      host,
      port,
      proxyUserName: currentUsername,
      password, // 注意：比特浏览器的字段名是 password，不是 proxyPassword
      proxyPassword: password, // 同时兼容两种写法，以防万一
      // 允许用户在单次调用时覆盖任何配置
      ...options,
    };

    // d. 调用底层的 create 函数
    return create(finalConfig);
  };
}
/**
 * [工厂函数 - 逻辑增强版] 创建一个特定用途的配置文件创建器。
 * @param {object} baseConfig - 用于此类配置的固定参数 (例如: { groupId, proxyType })。
 * @returns {function(string|object): Promise<string>} 一个可以创建配置文件的【新函数】。
 */
function createFactory(baseConfig) {
  /**
   * 这是工厂函数返回的专用函数。
   * 它负责处理简化输入，并将其转换为 `create` 函数所需的完整配置。
   * @param {string|object} input - "host:port" 格式的字符串或一个配置对象。
   */
  return async function profileCreator(input) {
    // 1. 从 baseConfig 开始构建最终的配置
    let finalConfig = { ...baseConfig };

    // 2. 解析输入 (`input`)
    let inputOptions = {};
    if (typeof input === "string" && input.includes(":")) {
      const [host, port] = input.split(":");
      inputOptions = { host, port };
    } else if (typeof input === "object" && input !== null) {
      inputOptions = input;
    } else if (input) {
      console.warn(
        `配置文件创建器的输入无效: ${input}。应为 "host:port" 字符串或对象。`
      );
    }

    // 3. 将解析后的输入合并到配置中，输入的优先级更高
    finalConfig = { ...finalConfig, ...inputOptions };

    // 4. 在这里执行所有的“智能处理”
    // 如果有代理信息...
    if (finalConfig.host && finalConfig.port) {
      // a. 确保 proxyType 正确 (如果 baseConfig 没提供，则默认为 'socks5')
      if (!finalConfig.proxyType || finalConfig.proxyType === "noproxy") {
        finalConfig.proxyType = "socks5";
      }
      // b. 自动生成名称 (仅当用户没有在 input 中明确提供 name 时)
      if (inputOptions.name === undefined) {
        finalConfig.name = `${finalConfig.host}:${finalConfig.port}`;
      }
    } else {
      // 如果没有代理信息，强制设为 noproxy
      finalConfig.proxyType = "noproxy";
    }
    return create(finalConfig);
  };
}

/**
 * API会自动检查id状态,选择打开或直接连接,返回含ws,puppeteer的对象
 */
async function open(id) {
  if (typeof id == "object") id = id.id;
  let res = await kit.req("http://127.0.0.1:54345/browser/open post", {
    json: {
      id,
      args: [
        // "--lang=en-US",
        // "--disable-translate",
        // "--disable-features=AutofillAddressProfileSavePrompt,AutofillCreditCardProfileSavePrompt",
        // "--password-store=basic",
      ],
      loadExtensions: false,
      extractIp: false,
    },
  });
  if (!res.data.data) return console.error(res.data);
  res = res.data.data;
  res.puppeteer = await connect(res.ws);
  return res;
}

/**
 * 获取所有浏览器配置文件，自动处理分页以拉取全部数据。
 * @param {object} filterOptions - 筛选选项，例如 { groupId, groupName, name, status }。
 * @returns {Promise<Array>} 返回所有匹配的配置文件组成的完整数组。
 *
 * @example res.filter(item=>item.groupName=='aws').filter(item=>item.status==1) // 筛选aws组的 已打开的浏览器
 */
async function list(filterOptions = {}) {
  let allProfiles = [];
  let currentPage = 0;
  const pageSize = 100; // API限制的每页最大数量
  while (true) {
    try {
      const res = await kit.req(
        "http://127.0.0.1:54345/browser/list/concise post",
        {
          json: {
            page: currentPage,
            pageSize: pageSize,
          },
        }
      );
      if (res.data && res.data.success && res.data.data && res.data.data.list) {
        const profilesOnPage = res.data.data.list;
        if (profilesOnPage.length === 0) {
          break; // 当前页无数据，说明已拉取完毕，退出循环
        }
        allProfiles.push(...profilesOnPage); // 将当前页数据追加到总列表
        if (profilesOnPage.length < pageSize) {
          break; // 返回的数据量小于每页最大数量，说明是最后一页，提前退出
        }
        currentPage++; // 准备请求下一页
      } else {
        console.error(
          "获取浏览器列表失败:",
          res.data ? res.data.msg : "无有效响应"
        );
        throw new Error(res.data ? res.data.msg : "API请求失败");
      }
    } catch (error) {
      console.error(`在获取第 ${currentPage} 页数据时发生网络错误:`, error);
      throw error;
    }
  }
  if (filterOptions) {
    allProfiles = allProfiles.filter((item) => {
      for (let key in filterOptions) {
        if (item[key] != filterOptions[key]) return false;
      }
      return true;
    });
  }
  return allProfiles;
}

async function close(id) {
  const res = await kit.req("http://127.0.0.1:54345/browser/close post", {
    json: { id },
  });
  return res.data;
}

async function del(ids) {
  const res = await kit.req("http://127.0.0.1:54345/browser/delete/ids post", {
    json: { ids },
  });
  return res.data;
}
async function delall() {
  const ids = (await list()).map((v) => v.id);
  const res = await kit.req("http://127.0.0.1:54345/browser/delete/ids post", {
    json: { ids },
  });
  return res.data;
}

/**
 * @description 获取浏览器详情 (暂时没啥用)
 * @param {String} id
 * @returns {Promise}
 * */
async function detail(id) {
  const res = await kit.reqdata("http://127.0.0.1:54345/browser/detail post", {
    json: { id },
  });
  return res;
}
