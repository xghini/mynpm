// 导入所有主要语言的 faker 实例（共49个）
import { faker as fakerZH } from '@faker-js/faker/locale/zh_CN';
import { faker as fakerJA } from '@faker-js/faker/locale/ja';
import { faker as fakerKO } from '@faker-js/faker/locale/ko';
import { faker as fakerEN } from '@faker-js/faker/locale/en_US';
import { faker as fakerRU } from '@faker-js/faker/locale/ru';
import { faker as fakerDE } from '@faker-js/faker/locale/de';
import { faker as fakerFR } from '@faker-js/faker/locale/fr';
import { faker as fakerES } from '@faker-js/faker/locale/es';
import { faker as fakerIT } from '@faker-js/faker/locale/it';
import { faker as fakerBR } from '@faker-js/faker/locale/pt_BR';
import { faker as fakerPT } from '@faker-js/faker/locale/pt_PT';
import { faker as fakerNL } from '@faker-js/faker/locale/nl';
import { faker as fakerPL } from '@faker-js/faker/locale/pl';
import { faker as fakerTR } from '@faker-js/faker/locale/tr';
import { faker as fakerSV } from '@faker-js/faker/locale/sv';
import { faker as fakerDA } from '@faker-js/faker/locale/da';
import { faker as fakerNO } from '@faker-js/faker/locale/nb_NO';
import { faker as fakerFI } from '@faker-js/faker/locale/fi';
import { faker as fakerHU } from '@faker-js/faker/locale/hu';
import { faker as fakerCZ } from '@faker-js/faker/locale/cs_CZ';
import { faker as fakerSK } from '@faker-js/faker/locale/sk';
import { faker as fakerRO } from '@faker-js/faker/locale/ro';
import { faker as fakerHR } from '@faker-js/faker/locale/hr';
import { faker as fakerRS } from '@faker-js/faker/locale/sr_RS_latin';
import { faker as fakerMK } from '@faker-js/faker/locale/mk';
import { faker as fakerGR } from '@faker-js/faker/locale/el';
import { faker as fakerLV } from '@faker-js/faker/locale/lv';
import { faker as fakerUK } from '@faker-js/faker/locale/uk';
import { faker as fakerAR } from '@faker-js/faker/locale/ar';
import { faker as fakerFA } from '@faker-js/faker/locale/fa';
import { faker as fakerHE } from '@faker-js/faker/locale/he';
import { faker as fakerTH } from '@faker-js/faker/locale/th';
import { faker as fakerVI } from '@faker-js/faker/locale/vi';
import { faker as fakerID } from '@faker-js/faker/locale/id_ID';
import { faker as fakerTW } from '@faker-js/faker/locale/zh_TW';
import { faker as fakerKA } from '@faker-js/faker/locale/ka_GE';
import { faker as fakerHY } from '@faker-js/faker/locale/hy';
import { faker as fakerAZ } from '@faker-js/faker/locale/az';
import { faker as fakerUZ } from '@faker-js/faker/locale/uz_UZ_latin';
import { faker as fakerTA } from '@faker-js/faker/locale/ta_IN';
import { faker as fakerBN } from '@faker-js/faker/locale/bn_BD';
import { faker as fakerNE } from '@faker-js/faker/locale/ne';
import { faker as fakerUR } from '@faker-js/faker/locale/ur';
import { faker as fakerYO } from '@faker-js/faker/locale/yo_NG';
import { faker as fakerZU } from '@faker-js/faker/locale/zu_ZA';
import { faker as fakerAF } from '@faker-js/faker/locale/af_ZA';
import { faker as fakerDV } from '@faker-js/faker/locale/dv';
import { faker as fakerCY } from '@faker-js/faker/locale/cy';
import { faker as fakerEO } from '@faker-js/faker/locale/eo';
import { faker } from '@faker-js/faker';
import { Country, State, City } from 'country-state-city';

// 将 faker 实例映射到国家/地区缩写上（共49个）
const instanceByCountryCode = {
  // 原有的4个 + 俄国
  CN: fakerZH,   // 中国 - 中文简体
  JP: fakerJA,   // 日本 - 日语
  KR: fakerKO,   // 韩国 - 韩语
  US: fakerEN,   // 美国 - 英语
  RU: fakerRU,   // 俄国 - 俄语
  
  // 欧洲语言
  DE: fakerDE,   // 德国 - 德语
  FR: fakerFR,   // 法国 - 法语
  ES: fakerES,   // 西班牙 - 西班牙语
  IT: fakerIT,   // 意大利 - 意大利语
  NL: fakerNL,   // 荷兰 - 荷兰语
  PL: fakerPL,   // 波兰 - 波兰语
  PT: fakerPT,   // 葡萄牙 - 葡萄牙语
  TR: fakerTR,   // 土耳其 - 土耳其语
  SE: fakerSV,   // 瑞典 - 瑞典语
  DK: fakerDA,   // 丹麦 - 丹麦语
  NO: fakerNO,   // 挪威 - 挪威语
  FI: fakerFI,   // 芬兰 - 芬兰语
  HU: fakerHU,   // 匈牙利 - 匈牙利语
  CZ: fakerCZ,   // 捷克 - 捷克语
  SK: fakerSK,   // 斯洛伐克 - 斯洛伐克语
  RO: fakerRO,   // 罗马尼亚 - 罗马尼亚语
  HR: fakerHR,   // 克罗地亚 - 克罗地亚语
  RS: fakerRS,   // 塞尔维亚 - 塞尔维亚语
  MK: fakerMK,   // 北马其顿 - 马其顿语
  GR: fakerGR,   // 希腊 - 希腊语
  LV: fakerLV,   // 拉脱维亚 - 拉脱维亚语
  UA: fakerUK,   // 乌克兰 - 乌克兰语
  
  // 中东和南亚
  SA: fakerAR,   // 沙特阿拉伯 - 阿拉伯语
  IR: fakerFA,   // 伊朗 - 波斯语
  IL: fakerHE,   // 以色列 - 希伯来语
  PK: fakerUR,   // 巴基斯坦 - 乌尔都语
  
  // 东南亚和南亚
  TH: fakerTH,   // 泰国 - 泰语
  VN: fakerVI,   // 越南 - 越南语
  ID: fakerID,   // 印度尼西亚 - 印度尼西亚语
  IN: fakerTA,   // 印度 - 泰米尔语
  BD: fakerBN,   // 孟加拉国 - 孟加拉语
  NP: fakerNE,   // 尼泊尔 - 尼泊尔语
  
  // 南美
  BR: fakerBR,   // 巴西 - 葡萄牙语
  
  // 东亚其他
  TW: fakerTW,   // 台湾 - 中文繁体
  
  // 高加索地区
  GE: fakerKA,   // 格鲁吉亚 - 格鲁吉亚语
  AM: fakerHY,   // 亚美尼亚 - 亚美尼亚语
  AZ: fakerAZ,   // 阿塞拜疆 - 阿塞拜疆语
  
  // 中亚
  UZ: fakerUZ,   // 乌兹别克斯坦 - 乌兹别克语
  
  // 非洲
  NG: fakerYO,   // 尼日利亚 - 约鲁巴语
  ZA: fakerZU,   // 南非 - 祖鲁语
  AF: fakerAF,   // 南非 - 南非荷兰语
  
  // 特殊语言/地区
  MV: fakerDV,   // 马尔代夫 - 马尔代夫语
  CY: fakerCY,   // 塞浦路斯/威尔士 - 威尔士语
  EO: fakerEO,   // 世界语
};

// 各国/地区手机号格式配置
const mobilePhoneFormats = {
  // 原有的4个 + 俄国
  CN: ['+8613#########','+8615#########','+8616#########','+8617#########','+8618#########','+8619#########',],                            // 中国：+86开头11位
  JP: ['+8190########', '+8180########', '+8170########'], // 日本：+81开头
  KR: '+82##########',                                  // 韩国：+82开头
  US: '+1##########',                                   // 美国：+1开头
  RU: '+7##########',                                   // 俄国：+7开头
  
  // 欧洲
  DE: '+49##########',                                  // 德国：+49开头
  FR: '+33#########',                                   // 法国：+33开头
  ES: '+34#########',                                   // 西班牙：+34开头
  IT: '+39##########',                                  // 意大利：+39开头
  NL: '+31#########',                                   // 荷兰：+31开头
  PL: '+48#########',                                   // 波兰：+48开头
  PT: '+351########',                                   // 葡萄牙：+351开头
  TR: '+90##########',                                  // 土耳其：+90开头
  SE: '+46#########',                                   // 瑞典：+46开头
  DK: '+45########',                                    // 丹麦：+45开头
  NO: '+47########',                                    // 挪威：+47开头
  FI: '+358########',                                   // 芬兰：+358开头
  HU: '+36#########',                                   // 匈牙利：+36开头
  CZ: '+420#########',                                  // 捷克：+420开头
  SK: '+421#########',                                  // 斯洛伐克：+421开头
  RO: '+40#########',                                   // 罗马尼亚：+40开头
  HR: '+385########',                                   // 克罗地亚：+385开头
  RS: '+381########',                                   // 塞尔维亚：+381开头
  MK: '+389########',                                   // 北马其顿：+389开头
  GR: '+30##########',                                  // 希腊：+30开头
  LV: '+371########',                                   // 拉脱维亚：+371开头
  UA: '+380#########',                                  // 乌克兰：+380开头
  
  // 中东和南亚
  SA: '+966#########',                                  // 沙特阿拉伯：+966开头
  IR: '+98##########',                                  // 伊朗：+98开头
  IL: '+972#########',                                  // 以色列：+972开头
  PK: '+92##########',                                  // 巴基斯坦：+92开头
  
  // 东南亚和南亚
  TH: '+66#########',                                   // 泰国：+66开头
  VN: '+84#########',                                   // 越南：+84开头
  ID: '+62##########',                                  // 印度尼西亚：+62开头
  IN: '+91##########',                                  // 印度：+91开头
  BD: '+880#########',                                  // 孟加拉国：+880开头
  NP: '+977##########',                                 // 尼泊尔：+977开头
  
  // 南美
  BR: '+55###########',                                 // 巴西：+55开头
  
  // 东亚其他
  TW: '+886#########',                                  // 台湾：+886开头
  
  // 高加索地区
  GE: '+995#########',                                  // 格鲁吉亚：+995开头
  AM: '+374########',                                   // 亚美尼亚：+374开头
  AZ: '+994########',                                   // 阿塞拜疆：+994开头
  
  // 中亚
  UZ: '+998########',                                   // 乌兹别克斯坦：+998开头
  
  // 非洲
  NG: '+234##########',                                 // 尼日利亚：+234开头
  ZA: '+27#########',                                   // 南非：+27开头
  AF: '+27#########',                                   // 南非（荷兰语）：+27开头
  
  // 特殊
  MV: '+960#######',                                    // 马尔代夫：+960开头
  CY: '+357########',                                   // 塞浦路斯：+357开头
  EO: '+###########',                                   // 世界语：通用格式
};

/**
 * 根据国家代码获取Country对象
 * @param {string} countryCode - 国家代码
 * @returns {Object|null} Country对象或null
 */
function getCountryByCode(countryCode) {
  const countries = Country.getAllCountries();
  return countries.find(country => country.isoCode === countryCode) || null;
}

/**
 * 生成真实的地理位置信息
 * @param {Object} fakerInstance - faker实例
 * @param {string} countryCode - 国家代码
 * @returns {Object} 包含state, city, zipCode的对象
 */
function generateRealLocationData(fakerInstance, countryCode) {
  const country = getCountryByCode(countryCode);
  
  if (!country) {
    // 如果找不到国家，回退到faker原始数据
    return {
      state: fakerInstance.location.state(),
      city: fakerInstance.location.city(),
      zipCode: fakerInstance.location.zipCode()
    };
  }

  // 获取该国家的所有州/省
  const states = State.getStatesOfCountry(countryCode);
  
  if (!states || states.length === 0) {
    // 如果没有州/省数据，生成城市和邮编
    const cities = City.getCitiesOfCountry(countryCode);
    if (cities && cities.length > 0) {
      const randomCity = faker.helpers.arrayElement(cities);
      return {
        state: '',
        city: randomCity.name,
        zipCode: fakerInstance.location.zipCode()
      };
    }
    // 完全回退到faker
    return {
      state: fakerInstance.location.state(),
      city: fakerInstance.location.city(),
      zipCode: fakerInstance.location.zipCode()
    };
  }

  // 随机选择一个州/省
  const randomState = faker.helpers.arrayElement(states);
  
  // 获取该州/省的城市
  const cities = City.getCitiesOfState(countryCode, randomState.isoCode);
  
  let cityName;
  if (cities && cities.length > 0) {
    const randomCity = faker.helpers.arrayElement(cities);
    cityName = randomCity.name;
  } else {
    // 如果没有该州的城市数据，使用州名作为城市名
    cityName = randomState.name;
  }

  return {
    state: randomState.name,
    city: cityName,
    zipCode: fakerInstance.location.zipCode()
  };
}

/**
 * 根据国家代码生成用户资料
 * @param {string} code - 国家缩写（如：CN, JP, KR, US, RU等）
 * @returns {Object|null} 用户资料对象或null
 */
function userinfo(code) {
  if (!code || typeof code !== 'string') {
    console.error("错误：请输入一个有效的国家缩写字符串。");
    return null;
  }
  
  code = code.toUpperCase();
  const instance = instanceByCountryCode[code];
  
  if (!instance) {
    console.error(`错误：无效的国家缩写 "${code}"。支持的缩写有：${Object.keys(instanceByCountryCode).join(', ')}`);
    return null;
  }

  // 获取手机号格式
  let phoneFormat = mobilePhoneFormats[code];
  if (Array.isArray(phoneFormat)) {
    phoneFormat = faker.helpers.arrayElement(phoneFormat);
  }

  // 生成真实的地理位置数据
  const locationData = generateRealLocationData(instance, code);

  return {
    name: instance.person.fullName(),
    avatar: faker.image.avatar(),
    email: instance.internet.email(),
    password: instance.internet.password(),
    phone: faker.helpers.replaceSymbols(phoneFormat),
    company: instance.company.name(),
    state: locationData.state,
    city: locationData.city,
    zipCode: locationData.zipCode,
    country: code
  };
}

/**
 * 生成指定州/省的用户资料
 * @param {string} countryCode - 国家代码
 * @param {string} stateCode - 州/省代码
 * @returns {Object|null} 用户资料对象或null
 */
function generateByState(countryCode, stateCode) {
  if (!countryCode || !stateCode) {
    console.error("错误：请输入有效的国家代码和州/省代码。");
    return null;
  }

  countryCode = countryCode.toUpperCase();
  const instance = instanceByCountryCode[countryCode];
  
  if (!instance) {
    console.error(`错误：无效的国家缩写 "${countryCode}"。`);
    return null;
  }

  const state = State.getStateByCodeAndCountry(stateCode, countryCode);
  if (!state) {
    console.error(`错误：在国家 "${countryCode}" 中找不到州/省代码 "${stateCode}"。`);
    return null;
  }

  const cities = City.getCitiesOfState(countryCode, stateCode);
  let cityName;
  
  if (cities && cities.length > 0) {
    const randomCity = faker.helpers.arrayElement(cities);
    cityName = randomCity.name;
  } else {
    // 如果没有该州的城市数据，使用州名作为城市名
    cityName = state.name;
  }

  // 获取手机号格式
  let phoneFormat = mobilePhoneFormats[countryCode];
  if (Array.isArray(phoneFormat)) {
    phoneFormat = faker.helpers.arrayElement(phoneFormat);
  }

  return {
    name: instance.person.fullName(),
    avatar: faker.image.avatar(),
    email: instance.internet.email(),
    password: instance.internet.password(),
    phone: faker.helpers.replaceSymbols(phoneFormat),
    company: instance.company.name(),
    state: state.name,
    city: cityName,
    zipCode: instance.location.zipCode(),
    country: countryCode
  };
}

/**
 * 获取指定国家的所有可用州/省
 * @param {string} countryCode - 国家代码
 * @returns {Array} 州/省列表
 */
function getStatesOfCountry(countryCode) {
  return State.getStatesOfCountry(countryCode) || [];
}

/**
 * 获取指定州/省的所有城市
 * @param {string} countryCode - 国家代码
 * @param {string} stateCode - 州/省代码
 * @returns {Array} 城市列表
 */
function getCitiesOfState(countryCode, stateCode) {
  return City.getCitiesOfState(countryCode, stateCode) || [];
}

/**
 * 获取所有支持的国家列表
 * @returns {Array} 国家代码数组
 */
function getSupportedCountries() {
  return Object.keys(instanceByCountryCode);
}

/**
 * 批量生成多个国家的用户资料
 * @param {Array} countryCodes - 国家代码数组
 * @returns {Object} 按国家分组的用户资料
 */
function generateMultipleProfiles(countryCodes) {
  const results = {};
  countryCodes.forEach(code => {
    const profile = userinfo(code);
    if (profile) {
      results[code] = profile;
    }
  });
  return results;
}

/**
 * 按地区获取支持的国家
 * @returns {Object} 按地区分组的国家列表
 */
function getCountriesByRegion() {
  return {
    eastAsia: ['CN', 'JP', 'KR', 'TW'],
    europe: ['DE', 'FR', 'ES', 'IT', 'NL', 'PL', 'PT', 'TR', 'SE', 'DK', 'NO', 'FI', 'HU', 'CZ', 'SK', 'RO', 'HR', 'RS', 'MK', 'GR', 'LV', 'UA', 'RU'],
    middleEast: ['SA', 'IR', 'IL'],
    southAsia: ['PK', 'IN', 'BD', 'NP'],
    southeastAsia: ['TH', 'VN', 'ID'],
    americas: ['US', 'BR'],
    caucasus: ['GE', 'AM', 'AZ'],
    centralAsia: ['UZ'],
    africa: ['NG', 'ZA', 'AF'],
    special: ['MV', 'CY', 'EO']
  };
}

/**
 * 获取指定国家的地理信息摘要
 * @param {string} countryCode - 国家代码
 * @returns {Object} 国家的地理信息摘要
 */
function getCountryGeoSummary(countryCode) {
  const country = getCountryByCode(countryCode);
  if (!country) {
    return { error: `Country ${countryCode} not found` };
  }

  const states = State.getStatesOfCountry(countryCode);
  const cities = City.getCitiesOfCountry(countryCode);

  return {
    country: country.name,
    countryCode: countryCode,
    currency: country.currency,
    states: states ? states.length : 0,
    cities: cities ? cities.length : 0,
    hasStates: states && states.length > 0,
    hasCities: cities && cities.length > 0
  };
}

// 使用示例
export function example(){
  console.log(`=== 支持的国家代码总数: ${getSupportedCountries().length} ===`);
  console.log(getSupportedCountries().join(', '));

  console.log("\n=== 地理信息摘要示例 ===");
  ['US', 'CN', 'DE', 'BR'].forEach(code => {
    const summary = getCountryGeoSummary(code);
    console.log(`${code}: ${summary.country} - ${summary.states} 个州/省, ${summary.cities} 个城市`);
  });

  console.log("\n=== 基于真实地理位置的用户生成示例 ===");

  console.log("\n--- CN (中国) ---");
  const userCN = userinfo('CN');
  console.log(userCN);

  console.log("\n--- JP (日本) ---");
  const userJP = userinfo('jp');
  console.log(userJP);

  console.log("\n--- KR (韩国) ---");
  const userKR = userinfo('KR');
  console.log(userKR);

  console.log("\n--- US (美国) ---");
  const userUS = userinfo('Us');
  console.log(userUS);

  console.log("\n--- RU (俄国) ---");
  const userRU = userinfo('RU');
  console.log(userRU);

  // 演示特定州/省的用户生成
  console.log("\n=== 指定州/省的用户生成示例 ===");
  const usStates = getStatesOfCountry('US');
  if (usStates.length > 0) {
    const randomState = faker.helpers.arrayElement(usStates);
    console.log(`\n--- 美国 ${randomState.name} 州的用户 ---`);
    const userFromState = generateByState('US', randomState.isoCode);
    console.log(userFromState);
  }  
}


// 导出函数供外部使用
export { 
  userinfo,
  generateByState,
  getSupportedCountries, 
  generateMultipleProfiles,
  getCountriesByRegion,
  getCountryGeoSummary,
  getStatesOfCountry,
  getCitiesOfState,
  getCountryByCode,
  instanceByCountryCode 
};