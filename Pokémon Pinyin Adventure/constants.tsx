import { Pokemon, PinyinData } from './types';

export const PINYIN_LEVELS: Record<number, PinyinData[]> = {
  // Level 1: 基础单韵母、简单声韵组合
  1: [
    { pinyin: 'a', char: '阿' }, { pinyin: 'o', char: '哦' }, { pinyin: 'e', char: '鹅' },
    { pinyin: 'i', char: '衣' }, { pinyin: 'u', char: '乌' }, { pinyin: 'ü', char: '鱼' },
    { pinyin: 'ba', char: '八' }, { pinyin: 'pa', char: '怕' }, { pinyin: 'ma', char: '妈' },
    { pinyin: 'fa', char: '法' }, { pinyin: 'da', char: '大' }, { pinyin: 'ta', char: '他' },
    { pinyin: 'na', char: '那' }, { pinyin: 'la', char: '拉' }, { pinyin: 'bo', char: '波' },
    { pinyin: 'po', char: '坡' }, { pinyin: 'mo', char: '摸' }, { pinyin: 'fo', char: '佛' },
    { pinyin: 'de', char: '德' }, { pinyin: 'te', char: '特' }, { pinyin: 'ne', char: '呢' },
    { pinyin: 'le', char: '乐' }, { pinyin: 'bi', char: '比' }, { pinyin: 'pi', char: '皮' },
    { pinyin: 'mi', char: '米' }, { pinyin: 'di', char: '地' }, { pinyin: 'ti', char: '题' },
    { pinyin: 'ni', char: '你' }, { pinyin: 'li', char: '里' }, { pinyin: 'bu', char: '不' },
    { pinyin: 'pu', char: '瀑' }, { pinyin: 'mu', char: '木' }, { pinyin: 'fu', char: '父' },
    { pinyin: 'du', char: '度' }, { pinyin: 'tu', char: '土' }, { pinyin: 'nu', char: '怒' },
    { pinyin: 'lu', char: '路' }
  ],
  // Level 2: 复韵母、前鼻音、中等难度声母
  2: [
    { pinyin: 'ai', char: '爱' }, { pinyin: 'ei', char: '诶' }, { pinyin: 'ui', char: '威' },
    { pinyin: 'ao', char: '奥' }, { pinyin: 'ou', char: '欧' }, { pinyin: 'iu', char: '优' },
    { pinyin: 'ie', char: '耶' }, { pinyin: 'üe', char: '约' }, { pinyin: 'er', char: '二' },
    { pinyin: 'an', char: '安' }, { pinyin: 'en', char: '恩' }, { pinyin: 'in', char: '因' },
    { pinyin: 'un', char: '温' }, { pinyin: 'ün', char: '云' }, { pinyin: 'ga', char: '嘎' },
    { pinyin: 'ka', char: '卡' }, { pinyin: 'ha', char: '哈' }, { pinyin: 'ji', char: '机' },
    { pinyin: 'qi', char: '七' }, { pinyin: 'xi', char: '西' }, { pinyin: 'ge', char: '哥' },
    { pinyin: 'ke', char: '科' }, { pinyin: 'he', char: '河' }, { pinyin: 'bai', char: '白' },
    { pinyin: 'pei', char: '陪' }, { pinyin: 'hui', char: '回' }, { pinyin: 'mao', char: '猫' },
    { pinyin: 'gou', char: '狗' }, { pinyin: 'niu', char: '牛' }, { pinyin: 'jie', char: '节' },
    { pinyin: 'xue', char: '学' }, { pinyin: 'pan', char: '盘' }, { pinyin: 'men', char: '门' },
    { pinyin: 'xin', char: '心' }, { pinyin: 'kun', char: '昆' }, { pinyin: 'jun', char: '军' }
  ],
  // Level 3: 后鼻音、翘舌音、平舌音、三拼音节
  3: [
    { pinyin: 'ang', char: '昂' }, { pinyin: 'eng', char: '哼' }, { pinyin: 'ing', char: '英' },
    { pinyin: 'ong', char: '轰' }, { pinyin: 'zha', char: '扎' }, { pinyin: 'cha', char: '查' },
    { pinyin: 'sha', char: '沙' }, { pinyin: 're', char: '热' }, { pinyin: 'za', char: '杂' },
    { pinyin: 'ca', char: '擦' }, { pinyin: 'sa', char: '撒' }, { pinyin: 'zhi', char: '支' },
    { pinyin: 'chi', char: '吃' }, { pinyin: 'shi', char: '师' }, { pinyin: 'ri', char: '日' },
    { pinyin: 'zi', char: '字' }, { pinyin: 'ci', char: '词' }, { pinyin: 'si', char: '四' },
    { pinyin: 'hua', char: '花' }, { pinyin: 'guo', char: '果' }, { pinyin: 'kua', char: '夸' },
    { pinyin: 'shuo', char: '说' }, { pinyin: 'tian', char: '天' }, { pinyin: 'lian', char: '连' },
    { pinyin: 'nian', char: '年' }, { pinyin: 'juan', char: '卷' }, { pinyin: 'quan', char: '全' },
    { pinyin: 'xuan', char: '选' }, { pinyin: 'guang', char: '光' }, { pinyin: 'huang', char: '黄' },
    { pinyin: 'qiang', char: '强' }, { pinyin: 'xiang', char: '香' }, { pinyin: 'jiong', char: '迥' },
    { pinyin: 'zhuang', char: '壮' }, { pinyin: 'shuang', char: '双' }, { pinyin: 'chuang', char: '床' }
  ]
};

// 宝可梦中文名称映射表（部分代表性，其余将展示编号）
const POKEMON_NAMES_ZH: Record<number, string> = {
  1: "妙蛙种子", 2: "妙蛙草", 3: "妙蛙花",
  4: "小火龙", 5: "火恐龙", 6: "喷火龙",
  7: "杰尼龟", 8: "卡咪龟", 9: "水箭龟",
  10: "绿毛虫", 12: "巴大蝶", 16: "波波", 18: "大比鸟",
  25: "皮卡丘", 26: "雷丘", 37: "六尾", 38: "九尾",
  39: "胖丁", 52: "喵喵", 54: "可达鸭", 55: "哥达鸭",
  63: "凯西", 65: "胡地", 74: "小拳石", 92: "鬼斯", 94: "耿鬼",
  129: "鲤鱼王", 130: "暴鲤龙", 131: "拉普拉斯", 133: "伊布",
  143: "卡比兽", 144: "急冻鸟", 145: "闪电鸟", 146: "火焰鸟",
  149: "快龙", 150: "超梦", 151: "梦幻",
  152: "菊草叶", 155: "火球鼠", 158: "小锯鳄",
  172: "皮丘", 175: "波克比", 183: "玛力露", 196: "太阳伊布", 197: "月亮伊布",
  243: "雷公", 244: "炎帝", 245: "水君", 248: "班基拉斯", 249: "洛奇亚", 250: "凤王", 251: "时拉比",
  252: "木守宫", 255: "火稚鸡", 258: "水跃鱼",
  282: "沙奈朵", 373: "暴飞龙", 376: "巨金怪", 
  380: "拉帝亚斯", 381: "拉帝欧斯", 382: "盖欧卡", 383: "固拉多", 384: "烈空坐", 385: "基拉祈", 386: "代欧奇希斯"
};

// 动态生成宝可梦库 (001 - 386)
export const POKEMONS: Pokemon[] = Array.from({ length: 386 }, (_, i) => {
  const id = i + 1;
  const nameZh = POKEMON_NAMES_ZH[id] || `宝可梦 #${id}`;
  
  // 简易难度分配逻辑
  let level = 1;
  if (id === 150 || id === 151 || id === 249 || id === 250 || id === 251 || id >= 380) {
    level = 3; // 传说/幻之
  } else if (id % 3 === 0 || id === 25 || id === 133 || id === 143) {
    level = 3; // 最终进化型或超人气
  } else if (id % 3 === 2) {
    level = 2; // 一阶进化
  }

  return {
    id,
    name: nameZh,
    level,
    url: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id.toString().padStart(3, '0')}.png`
  };
});
