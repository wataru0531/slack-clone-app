
// /lib/file-uploader.ts

import multer from 'multer';
import path from 'path';
import { mkdirSync } from 'fs';
import { Request, Response } from 'express';


// ✅ 画像ファイルをサーバーに保存して、そのURLとフォームデータを返す処理
// 呼び出し元の処理　account.controller.ts
// →  const { fileUrl, body } = await upload(req, res, 'account');

export const upload = ( req: Request, res: Response, folderName: string
): Promise<{ fileUrl: string | null; body: any }> => {
  const destination = `uploads/${folderName}`; // フォルダ名を定義

  mkdirSync(destination, { recursive: true }); // 同期的に保存用フォルダを作成
                                              //  recursive: true ... 必要なフォルダを全部自動生成
                                              //  → falseで、uploadsフォルダがなければエラー

  // ✅ どう保存するかの設定を組む → ディスク保存用の設定オブジェクトを生成
  // → この時点では保存していない。
  // 👉 multer ... Expressでファイルアップロードを扱うためのライブラリ
  //               ファイルアップロード処理ミドルウェアのこと
  // diskStorage() → ファイルをディスク(サーバーのフォルダ)に保存する方式
  const storage = multer.diskStorage({ 
    destination, // このフォルダに保存。uploads/account に入れる。
    // ファイル名をを設定
    filename: (_req: Request, file: Express.Multer.File, cb: any) => {
      // ファイル名をランダム化 =  現在時刻をミリ秒に変換 + - Math.round((0 〜 1) * 10億)
      // → 元ファイル名を使うと、同じ名前が来るので、新しいファイルが古いファイルを上書きしてしまう。
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // 四捨五入
      // 例: 1715500000000-483726120

      // 拡張子を取得
      // file.originalname → 元ファイル名が入る
      const ext = path.extname(file.originalname);

      // cb → コールバック
      // この関数で、multerにファイル名を通知する
      cb(null, uniqueSuffix + ext);
    },
  });

  // ✅ アップロード処理オブジェクトを作成
  const upload = multer({
    storage, // 保存方法(保存先、ファイル名)
    limits: {
      fileSize: 20 * 1024 * 1024, // ファイルのサイズ制限。20MBまで。それを超えたらアップロード拒否
    },
  });

  return new Promise((resolve, reject) => {
    // ⭐️ 実際のアップロード処理
    // upload.single() → middleware関数を返す
    // const middleware = upload.single() のような感じ。
    // そして、middleware(req, res, (error: any) => {}) を実行
    upload.single('file')(req, res, (err: any) => {
      if(err != null) return reject(err); // アップロード失敗時

      // ✅ 現在のサーバーのURLを作る
      // URL生成 http://localhost:3000
      // req.get("host") → リクエストヘッダーのHostを取得
      // ホストこのリクエストが届いた宛先の住所
      // スキーム: https。 ホスト: www.example.com。 ポート: 443
      const baseURL = req.protocol + '://' + req.get('host');

      resolve({
        // ファイルURLを生成 http://localhost:3000/uploads/account/123.png
        // req.file.path → multerのuploadオブジェクトの保存方法(保存先、名前)を参照
        fileUrl: req.file != null ? `${baseURL}/${req.file.path}` : null,
        body: req.body, // 画像以外のデータ nameなど
      });
    });
  });
};
