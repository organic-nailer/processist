import * as functions from "firebase-functions";
import { App, ExpressReceiver } from "@slack/bolt";
import { google } from "googleapis";

const config = functions.config();

export const expressReceiver = new ExpressReceiver({
  signingSecret: config.slack.secret,
  endpoints: "/events",
});

const app = new App({
  receiver: expressReceiver,
  token: config.slack.token,
});

app.message(async ({ message, say, context }) => {
  //await say(`すっごーい!`);
  let max = Math.floor(Math.random() * 10);

  let msg = "";

  const words: string[] = await getHomeWords();

  for (let i = 0; i < max; i++) {
    msg += words[Math.floor(Math.random() * words.length)] + bikkuri();
    msg += " ";
  }

  try {
    await app.client.chat.postMessage({
      token: context.botToken,
      channel: message.channel,
      text: msg,
      thread_ts: message.ts,
    });
    await app.client.reactions.add({
      token: context.botToken,
      channel: message.channel,
      name: "god",
      timestamp: message.ts,
    });
  } catch (e) {
    console.log(e);
  }
});

function bikkuri() {
  const random = Math.max(Math.floor(Math.random() * 10) - 8, 0);
  let ret = "";
  for (let i = 0; i < random; i++) {
    ret += "!";
  }
  return ret;
}

/*const homeWord = ["気品がある", "偏差値が高い", "頭がいい", "イケメン美女揃い", "運動もバリバリできる", "面白い話ができる", "国民の尊敬を集める", "みんなから人気", "リーダーシップもある", "思いやりがある", "神", "進捗の猛者", "スゴイ", "頼れる", "カッコいい", "おもしろい", "頭がいい", "デキる男", "一生ついていく", "頭の回転が速い", "モテる", "勉強になる", "かしこい", "えらい", "世界に光が訪れる", "皆の憧れ", "偉大", "流石", "感動", "よく考えている", "輝いている", "素敵", "まっすぐ", "親孝行", "いい", "性格がいい", "活躍できる", "絶妙", "さりげない", "謙虚", "やさしい", "力強い", "努力家", "才能のかたまり", "意思が強い", "明るい", "成長の権化", "集中力がある", "鋭い", "一流", "みんなのことを考えている", "大人", "プロ", "ノーベル賞級", "大物", "オーラ", "繊細", "大きく羽ばたく", "センターを取れる", "センスが良い", "すき", "尊敬の的", "かなわない", "素晴らしい", "謹厳実直", "質実剛健", "天真爛漫", "明朗闊達", "春風駘蕩", "一片氷心", "新進気鋭", "八面六臂", "博識多才", "詠雪之才", "蓋世之材", "文武両道", "才色兼備", "知勇兼備", "鶏群一鶴", "世界一", "日本一", "40年に一人の逸材", "理解を超えた存在", "人類の至宝", "人間国宝", "物知り", "モチベーションが高い", "魅力的", "スペシャリスト", "セクシー", "休んで", "ハンサム", "アイデアが豊富", "アグレッシブ", "石油王", "エベレスト", "太平洋", "安心", "艶がある", "華がある", "完全体", "器用", "教養がある", "決断力がある", "個性的", "献身的", "熱心", "姿勢がいい", "字がうまい", "趣味が良い", "笑顔が素敵", "情熱的", "信頼できる", "心が広い", "紳士", "ジェントルマン", "惹きつけられる", "責任感がある", "創造神", "圧倒的な存在感", "品がある", "雰囲気がいい", "本質を理解している", "夢がある", "問題解決力がある", "優秀", "理解力がある", "話題が豊富", "知らなかった", "一緒にいると楽しい", "魅力的", "癒やされる", "渋い", "大物", "いいヤツ", "貫禄がある", "グルメ", "特別な存在", "キュート", "スマート", "都会的", "歯並びがきれい", "若い", "幸せの根源", "気品の泉源", "知徳の模範", "感受性豊か", "芯が強い", "見る目がある", "生まれてきてくれてありがとう", "後光が差している", "立派", "チャレンジャー", "丁寧", "君らしい", "物覚えが良い", "将来に期待できる", "出世コース", "可能性を感じる", "大器晩成", "核兵器保有", "悪徳商人", "CEO"];
 */

async function getHomeWords() {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets("v4");
  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: "SPREAD_SHEET_ID",
    range: "sheet1!A1:A1000",
    auth: auth,
  });

  const reduced =
    resp.data.values?.reduce((pre, current) => {
      pre.push(...current);
      return pre;
    }, []) || [];

  //console.log(reduced);

  return reduced.filter((value: any) => value !== "") || [];
}

// (async () => {
// 	await app.start(process.env.PORT || 3000);
// })
