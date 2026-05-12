
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
  const destination = `uploads/${folderName}`;

  mkdirSync(destination, { recursive: true }); // 同期的に保存用フォルダを作成
                                              //  recursive: true ... 必要なフォルダを全部自動生成
                                              //  → falseで、uploadsフォルダがなければエラー

  // ⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから
  // ⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから
  // ⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから⭐️ここから

  // どう保存するかの設定を組む
  // 👉 multer ... ファイルを受け取るライブラリ
  // diskStorage() → ファイルをディスク(サーバーのフォルダ)に保存する方式
  const storage = multer.diskStorage({ 
    destination, // このフォルダに保存
    // ファイル名を生成
    filename: (_req: Request, file: Express.Multer.File, cb: any) => {
      // ファイル名をランダム化 =  現在時刻をミリ秒 + - Math.round((0 〜 1) * 10億)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // 四捨五入
      // 拡張子を保持
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    },
  });

  const upload = multer({
    storage, // 保存方法
    limits: {
      fileSize: 20 * 1024 * 1024, // ファイルのサイズ制限。20MBまで
    },
  });

  return new Promise((resolve, reject) => {
    // ⭐️ 実際のアップロード処理
    // リクエストの中から、file という名前のファイルを1つ受け取る
    upload.single('file')(req, res, (err: any) => {
      if(err != null) return reject(err); // アップロード失敗時

      // URL生成 http://localhost:3000
      const baseURL = req.protocol + '://' + req.get('host');

      resolve({
        // ファイルURL http://localhost:3000/uploads/account/123.png
        fileUrl: req.file != null ? `${baseURL}/${req.file.path}` : null,
        body: req.body, // 画像以外のデータ nameなど
      });
    });
  });
};
