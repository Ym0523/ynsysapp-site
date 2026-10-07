/**
 * よだき屋 ホームページの問い合わせを info@yodakiya.com にメールで届ける Google Apps Script。
 *
 * 置き場所：info@yodakiya.com の Google アカウントで https://script.google.com/ →「新しいプロジェクト」に貼り付ける。
 * 準備：
 *   1. 左の歯車「プロジェクトの設定」→「スクリプト プロパティ」に
 *        CONTACT_SECRET ＝（Cloudflare 側と同じ合言葉）
 *      を追加する。
 *   2. 右上「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 *        次のユーザーとして実行：自分（info@yodakiya.com）
 *        アクセスできるユーザー：全員
 *      でデプロイし、表示された「ウェブアプリのURL」を Cloudflare の CONTACT_GAS_URL に入れる。
 *   3. 初回だけメール送信の許可を求められるので「許可」する。
 *
 * ホームページの Cloudflare Worker（src/worker.js）が入力を確かめたうえでここに送ってくる。
 * 合言葉が一致しないものは何もしない。
 */
const TO = 'info@yodakiya.com';

function doPost(e) {
  const out = (o) => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return out({ ok: false, error: 'json' }); }
  const secret = PropertiesService.getScriptProperties().getProperty('CONTACT_SECRET');
  if (!secret || d.secret !== secret) return out({ ok: false, error: 'secret' });

  const name = String(d.name || '').slice(0, 100);
  const email = String(d.email || '').slice(0, 200);
  const type = String(d.type || '').slice(0, 50);
  const body = String(d.body || '').slice(0, 4000);
  const now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');

  MailApp.sendEmail({
    to: TO,
    replyTo: email,
    name: 'よだき屋 ホームページ',
    subject: '【HPお問い合わせ】' + type + '（' + name + ' 様）',
    body:
      'ホームページのフォームからお問い合わせがありました。\n' +
      'このメールに返信すると、お客様（' + email + '）に届きます。\n\n' +
      '受付日時：' + now + '\n' +
      'お名前　：' + name + '\n' +
      'メール　：' + email + '\n' +
      '種類　　：' + type + '\n\n' +
      '― お問い合わせ内容 ―\n' + (body || '（未記入）') + '\n',
  });
  return out({ ok: true });
}
