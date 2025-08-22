// 导出所有函数
export {
  userinfo,
  username,
  generateValidUSUserInfo,
  generateValidUSPhone,
  VALID_US_ADDRESSES,
  US_AREA_CODES,
};
import { faker } from "@faker-js/faker";
import { Country, State, City } from "country-state-city";

// 美国真实地址数据（这些是常用的、能通过验证的地址组合）
const VALID_US_ADDRESSES = [
  {
    state: "CA",
    stateName: "California",
    city: "Los Angeles",
    zip: "90001",
    streets: ["Main Street", "Broadway", "Spring Street", "Hill Street"],
  },
  {
    state: "CA",
    stateName: "California",
    city: "San Francisco",
    zip: "94102",
    streets: [
      "Market Street",
      "Mission Street",
      "Howard Street",
      "Folsom Street",
    ],
  },
  {
    state: "NY",
    stateName: "New York",
    city: "New York",
    zip: "10001",
    streets: ["5th Avenue", "Broadway", "Madison Avenue", "Park Avenue"],
  },
  {
    state: "NY",
    stateName: "New York",
    city: "Brooklyn",
    zip: "11201",
    streets: ["Atlantic Avenue", "Court Street", "Smith Street", "Jay Street"],
  },
  {
    state: "TX",
    stateName: "Texas",
    city: "Houston",
    zip: "77001",
    streets: [
      "Main Street",
      "Texas Avenue",
      "Louisiana Street",
      "Smith Street",
    ],
  },
  {
    state: "TX",
    stateName: "Texas",
    city: "Dallas",
    zip: "75201",
    streets: ["Main Street", "Commerce Street", "Elm Street", "Ross Avenue"],
  },
  {
    state: "FL",
    stateName: "Florida",
    city: "Miami",
    zip: "33101",
    streets: [
      "Biscayne Boulevard",
      "Flagler Street",
      "Collins Avenue",
      "Ocean Drive",
    ],
  },
  {
    state: "IL",
    stateName: "Illinois",
    city: "Chicago",
    zip: "60601",
    streets: [
      "Michigan Avenue",
      "State Street",
      "LaSalle Street",
      "Wacker Drive",
    ],
  },
  {
    state: "WA",
    stateName: "Washington",
    city: "Seattle",
    zip: "98101",
    streets: ["1st Avenue", "Pike Street", "Pine Street", "Stewart Street"],
  },
  {
    state: "MA",
    stateName: "Massachusetts",
    city: "Boston",
    zip: "02108",
    streets: [
      "Washington Street",
      "State Street",
      "Congress Street",
      "Summer Street",
    ],
  },
];

// 美国电话区号映射（真实的区号）
const US_AREA_CODES = {
  CA: [
    "213",
    "310",
    "323",
    "408",
    "415",
    "510",
    "619",
    "626",
    "650",
    "714",
    "818",
    "925",
  ],
  NY: [
    "212",
    "315",
    "347",
    "516",
    "518",
    "585",
    "607",
    "631",
    "646",
    "716",
    "718",
    "845",
    "914",
    "917",
  ],
  TX: [
    "214",
    "254",
    "281",
    "361",
    "409",
    "430",
    "432",
    "469",
    "512",
    "713",
    "806",
    "817",
    "830",
    "903",
    "915",
    "936",
    "940",
    "956",
    "972",
  ],
  FL: [
    "239",
    "305",
    "321",
    "352",
    "386",
    "407",
    "561",
    "727",
    "754",
    "772",
    "786",
    "813",
    "850",
    "863",
    "904",
    "941",
    "954",
  ],
  IL: [
    "217",
    "224",
    "309",
    "312",
    "331",
    "618",
    "630",
    "708",
    "773",
    "779",
    "815",
    "847",
  ],
  WA: ["206", "253", "360", "425", "509"],
  MA: ["339", "351", "413", "508", "617", "774", "781", "857", "978"],
};

/**
 * 生成有效的美国电话号码
 * @param {string} stateCode - 州代码
 * @returns {string} 格式化的美国电话号码
 */
function generateValidUSPhone(stateCode = "CA") {
  const areaCodes = US_AREA_CODES[stateCode] || US_AREA_CODES["CA"];
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];

  // 生成有效的中间三位（不能是 555，除了 555-0100 到 555-0199）
  const validExchanges = [
    "201",
    "202",
    "203",
    "204",
    "205",
    "206",
    "207",
    "208",
    "209",
    "210",
    "212",
    "213",
    "214",
    "215",
    "216",
    "217",
    "218",
    "219",
    "220",
    "223",
    "224",
    "225",
    "226",
    "227",
    "228",
    "229",
    "230",
    "231",
    "234",
    "236",
    "238",
    "239",
    "240",
    "242",
    "243",
    "244",
    "245",
    "246",
    "247",
    "248",
    "249",
    "250",
    "251",
    "252",
    "253",
    "254",
    "256",
    "257",
    "258",
    "259",
    "260",
    "262",
    "263",
    "264",
    "265",
    "266",
    "267",
    "268",
    "269",
    "270",
    "271",
    "272",
    "273",
    "274",
    "276",
    "278",
    "279",
    "280",
    "281",
    "283",
    "284",
    "285",
  ];

  const exchange =
    validExchanges[Math.floor(Math.random() * validExchanges.length)];
  const subscriber = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  // 返回多种格式，选择最常用的
  return `+1 ${areaCode}${exchange}${subscriber}`;
}

/**
 * 生成街道号码
 * @returns {string} 街道号码
 */
function generateStreetNumber() {
  return Math.floor(Math.random() * 9999) + 1;
}

/**
 * 生成公寓/套房号（可选）
 * @returns {string} 公寓号
 */
function generateAptNumber() {
  const hasApt = Math.random() > 0.7; // 30%概率有公寓号
  if (hasApt) {
    const aptTypes = ["Apt", "Suite", "Unit"];
    const type = aptTypes[Math.floor(Math.random() * aptTypes.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return `, ${type} ${number}`;
  }
  return "";
}

/**
 * 生成完整的、能通过验证的美国用户资料
 * @param {string} [countryCode='US'] - 国家代码
 * @returns {Object} 用户资料对象
 */
function generateValidUSUserInfo(countryCode = "US") {
  // 随机选择一个有效的地址组合
  const addressData =
    VALID_US_ADDRESSES[Math.floor(Math.random() * VALID_US_ADDRESSES.length)];

  // 随机选择街道
  const street =
    addressData.streets[Math.floor(Math.random() * addressData.streets.length)];

  // 生成完整街道地址
  const streetNumber = generateStreetNumber();
  const aptNumber = generateAptNumber();
  const fullAddress = `${streetNumber} ${street}${aptNumber}`;

  // 生成其他用户信息
  const userInfo = {
    // 个人信息
    firstName: faker.person.firstName("male"),
    lastName: faker.person.lastName(),
    fullName: null, // 将在下面设置
    email: null, // 将在下面设置
    password: faker.internet.password({
      length: 12,
      memorable: false,
      pattern: /[A-Za-z0-9!@#$%^&*]/,
      prefix: "Aa1!", // 确保包含大写、小写、数字和特殊字符
    }),

    // 联系信息
    phone: generateValidUSPhone(addressData.state),
    phoneAlternative: `+1 ${Math.floor(Math.random() * 900) + 100}${
      Math.floor(Math.random() * 900) + 100
    }${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,

    // 地址信息（核心部分）
    address: fullAddress,
    addressLine1: fullAddress,
    addressLine2: "", // 通常留空，或者可以添加 "Building A" 之类的
    city: addressData.city,
    state: addressData.state,
    stateName: addressData.stateName,
    zip: addressData.zip,
    zipPlus4: addressData.zip + "-" + (Math.floor(Math.random() * 9000) + 1000), // ZIP+4 格式
    country: "United States",
    countryCode: "US",

    // 公司信息（可选）
    company: faker.company.name(),

    // 额外的验证友好字段
    formattedAddress: null, // 将在下面设置
    coordinates: getApproximateCoordinates(addressData.state), // 大概的坐标
  };

  // 设置全名和邮箱（使用名字生成，更真实）
  userInfo.fullName = `${userInfo.firstName} ${userInfo.lastName}`;
  userInfo.email = `${userInfo.firstName.toLowerCase()}.${userInfo.lastName.toLowerCase()}${Math.floor(
    Math.random() * 100
  )}@gmail.com`;

  // 设置格式化的完整地址
  userInfo.formattedAddress = `${userInfo.addressLine1}, ${userInfo.city}, ${userInfo.state} ${userInfo.zip}, ${userInfo.country}`;

  return userInfo;
}

/**
 * 获取州的大概坐标（用于地图验证）
 * @param {string} stateCode - 州代码
 * @returns {Object} 坐标对象
 */
function getApproximateCoordinates(stateCode) {
  const coordinates = {
    CA: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    NY: { lat: 40.7128, lng: -74.006 }, // New York
    TX: { lat: 29.7604, lng: -95.3698 }, // Houston
    FL: { lat: 25.7617, lng: -80.1918 }, // Miami
    IL: { lat: 41.8781, lng: -87.6298 }, // Chicago
    WA: { lat: 47.6062, lng: -122.3321 }, // Seattle
    MA: { lat: 42.3601, lng: -71.0589 }, // Boston
  };

  return coordinates[stateCode] || coordinates["CA"];
}

/**
 * 生成简化版的用户信息（兼容原接口）
 * @param {string} [code='US'] - 国家代码
 * @returns {Object} 用户资料对象
 */
function userinfo(code = "US") {
  if (code !== "US") {
    console.warn("目前只支持美国地址生成");
  }

  const info = generateValidUSUserInfo("US");

  // 返回兼容原接口的格式
  return {
    fullname: info.fullName,
    email: info.email,
    password: info.password,
    phone: info.phone,
    company: info.company,
    address: info.address,
    city: info.city,
    state: info.state,
    zip: info.zip,
    country: info.country,
    countryCode: info.countryCode,
    // 额外提供更多有用的字段
    _extended: {
      firstName: info.firstName,
      lastName: info.lastName,
      addressLine1: info.addressLine1,
      addressLine2: info.addressLine2,
      stateName: info.stateName,
      formattedAddress: info.formattedAddress,
      phoneAlternative: info.phoneAlternative,
      zipPlus4: info.zipPlus4,
      coordinates: info.coordinates,
    },
  };
}

/**
 * 生成英文用户名
 * @returns {string} 全名
 */
function username() {
  return faker.person.fullName();
}
