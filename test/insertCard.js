import kit from "@ghini/kit";
const pg = kit.xpg();
// let data = cardData("./福利.txt");
let data = cardData("./card100.txt");
console.log(data, data.length);
process.exit();
await pg.insert("card", data, { onconflict: ["cid"] });

// data = { cid: "4205217877731203", exp_date: "12/27", cvv: "511" };
// await pg.truncate("card");
// await pg.insert("card", data, { onconflict: ["cid"] });

find(pg, "card");

async function find(pg, table) {
  const [err, res] = await pg.query(
    `SELECT * FROM ${table} WHERE used=0 LIMIT 5`
  );
  console.log(res.rows);
}
async function update() {
  const [err, res] = await pg.query(`UPDATE card SET used=1 WHERE id=1`);
}

/**
 * 智能处理和检查卡格式,至少要有最核心的cid,date,cvv
 * 输入初步处理后的单条数据数组
 */
function cardData(filePath = "./福利.txt") {
  let data = kit.rf(filePath);
  if (!data) return [];
  data = data.split(/[\r\n]+/).filter(item => item.length>20); //去掉过短或空内容
  data = data.map((item) => {
    // 保护后面的邮政编码,取前面的40位来处理
    const boundary = 40;
    const head = item.slice(0, boundary);
    const tail = item.slice(boundary);
    return (
      head
        .replace(/(?<!\d)(\d{1,2})20(\d{2})(?!\d)/, "$1/$2") //比如无辜的邮政编码 12078就被“变身”成了'1/78'
        .replace(/(?<!\d)20(\d{2})(\d{1,2})(?!\d)/, "$2/$1")
        .replace(/\/\s*(\d{1,2})\s*\/\s*(\d{2,4})\s*\//, "|$1/$2|")
        .replace(/\/\s*(\d{2,4})\s*\/\s*(\d{1,2})\s*\//, "|$2/$1|")
        .replace(/\|\s*(\d{1,2})\s*\|\s*(\d{2,4})\s*\|/, "|$1/$2|")
        .replace(/\|\s*(\d{2,4})\s*\|\s*(\d{1,2})\s*\|/, "|$2/$1|")
        .replace(/\|\s*(\d{1,2})\s*\/\s*(\d{2,4})\s*\|/, "|$1/$2|")
        .replace(/\|\s*(\d{2,4})\s*\/\s*(\d{1,2})\s*\|/, "|$2/$1|")
        .replace(/\|(\d{1,2})\/(\d{2,4})\|/, (match, p1, p2) => {
          if (p1.length == 1) p1 = "0" + p1;
          p2 = p2.slice(-2);
          if (p1 > p2) return `|${p2}/${p1}|`;
          return `|${p1}/${p2}|`;
        })
        .replace(/United.{0,2}States/i, "US") + tail
    );
  });
  data = data.map((item) => {
    let cid,
      exp_date,
      cvv,
      name,
      address,
      city,
      state,
      zip,
      country,
      arr = item.split(/\|+|\:+|,+/).map((item) => item.trim());
    cid = arr.filter((item) => /^\d{13,}$/.test(item))[0];
    exp_date = arr.filter((item) => /\//.test(item))[0];
    cvv = arr.filter((item) => /^\d{3,4}$/.test(item))[0];
    arr = arr.filter((v) => v != cid && v != exp_date && v != cvv);
    arr = arr.filter((item) => /^[a-zA-Z\d\s-\.\+]+$/.test(item)); //此匹配已排除了邮箱
    // 方案1 常规排序 name-address-city-state-zip-country
    // 常会出现state被省略情况 标准长度为7 6基本就是省略了state
    // if (arr.length < 7) console.log(3333, arr, arr.length, cid, exp_date, cvv);
    name = arr[0];
    address = arr[1];
    city = arr[2];
    console.log(arr,cid);
    if (arr[3].match(/\d/)) {
      // state = arr[2]; //有条件再为其调用匹配正确的state
      zip = arr[3];
      country = arr[4];
    } else {
      state = arr[3];
      zip = arr[4];
      country = arr[5];
    }
    // 方案2 特征
    // if (arr.length > 1) {
    //   // 分有数字和没数字两种情况
    //   let p1 = arr.filter((v) => v.match(/\d/)),
    //     p2 = arr.filter((v) => !v.match(/\d/));
    //   if (p1.length > 0) {
    //     const sort1 = p1.sort((a, b) => b.length - a.length);
    //     address = sort1[0];
    //     if (p2.length == 0) name = sort1[1];
    //     else name = p2.sort((a, b) => b.length - a.length)[0];
    //   } else {
    //     const sort2 = p2.sort((a, b) => b.length - a.length);
    //     if (sort2.length == 1) name = sort2[0];
    //     else {
    //       address = sort2[0];
    //       name = sort2[1];
    //     }
    //   }
    // } else {
    //   name = name[0];
    // }
    return {
      cid,
      exp_date,
      cvv,
      name,
      address,
      city,
      state,
      zip,
      country,
      used: 100, //根据业务需求,非必要
    };
  });
  data = data
    .filter((item) => item.cid && item.exp_date)
    .filter((item) => {
      let [m, y] = item.exp_date.split("/");
      if (y.length == 2) y = "20" + y;
      let date = new Date(y, m);
      if (date > new Date()) return true;
      else console.warn(`date过期:`, item.exp_date, item.cid);
    });

  // --- 步骤 1: 将所有数据按cid进行分组 ---
  const groupedByCid = new Map();
  for (const card of data) {
    if (!groupedByCid.has(card.cid)) {
      groupedByCid.set(card.cid, []);
    }
    groupedByCid.get(card.cid).push(card);
  }

  // --- 步骤 2: [保留打印] 找出并打印出所有重复的组 ---
  // console.log("\n--- 开始检查重复的CID ---");
  // let duplicateCount = 0;
  // for (const [cid, group] of groupedByCid.entries()) {
  //   if (group.length > 1) {
  //     duplicateCount++;
  //     console.log(`\n[发现重复] CID: ${cid} (共 ${group.length} 条)`);
  //     console.log(group);
  //   }
  // }
  // if (duplicateCount === 0) console.log("未发现任何重复的CID。");
  // console.log("--- 检查结束 ---\n");
  // =================================================================
  // [已完成] 步骤 3: 从分组数据中，根据你的规则筛选出最终数据
  // =================================================================
  const finalData = [];
  for (const group of groupedByCid.values()) {
    if (group.length === 1) {
      // 如果这组只有一条，说明它不重复，直接采纳
      finalData.push(group[0]);
    } else {
      // 如果这组有多条（重复），则根据规则选出最新的那一条
      const bestCard = group.reduce((best, current) => {
        const bestScore = best.exp_date.slice(3) + best.exp_date.slice(0, 2);
        const currentScore =
          current.exp_date.slice(3) + current.exp_date.slice(0, 2);
        return currentScore > bestScore ? current : best;
      });
      finalData.push(bestCard);
    }
  }
  return finalData;
}
