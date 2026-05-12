
// auth.controllers.ts

import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { User } from '../users/user.entity';
import { compare, hash } from 'bcryptjs';
import { encodeJwt } from '../../lib/jwt';

// ✅ Router → ルーティングを振り分ける。/signup、/signin、/me に振り分けている。
//             小さいExpressルーター。
//             /auth がきたら、authControllerに渡す。
const authController = Router();
const userRepository = datasource.getRepository(User);


// ✅ ユーザー登録
// Expressサーバーがリクエストを受け入れる。
authController.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: '名前、メール、パスワードは必須です' });
      return;
    }

    // ✅ メールアドレスの重複チェック
    // useRepository → Userテーブル操作オブジェクトを生成
    // findOne → SQL的に言うと、SELECT * FROM user WHERE email = ? LIMIT 1
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res
        .status(400)
        .json({ message: 'このメールアドレスは既に使用されています' });
      return;
    }

    const hashedPassword = await hash(password, 10); // パスワードのハッシュ化

    // ユーザー作成
    // save → SQLでは、INSERT INTO users ...のような感じ
    const user = await userRepository.save({
      name,
      email,
      password: hashedPassword,
    });

    // ✅ JWT → 改ざんできない「デジタル身分証」。ヘッダー.ペイロード.署名でできている。
    // ログイン成功 → サーバーがトークン発行 → クライアントが保存 → 以後それを提示して通信
    const token = encodeJwt(user.id);

    // パスワードを除外して、レスポンスをフロントに返す
    // password: _, でpasswordを_という変数で受けとり、これは使わない
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ✅ ログイン
authController.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 必須項目のバリデーション
    if (!email || !password) {
      res.status(400).json({ message: 'メールとパスワードは必須です' });
      return;
    }

    // ユーザーの検索
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
      return;
    }

    // パスワードの確認
    // compare → ユーザーが入力したパスワード、DBに保存されているハッシュ化されたパスワード」が一致するか
    //           どうかを確認
    //           内部では、入力したパスをハッシュ化して照合している
    const isPasswordValid = await compare(password, user.password);
    if(!isPasswordValid) {
      res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
      return;
    }

    // JWTトークンの生成
    // → サインアップ時にも生成するが、既にクライアントにあるJWTトークンを上書きする処理を組む
    const token = encodeJwt(user.id);

    // パスワードを除外してレスポンスを返す
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('ログインエラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});


// 現在ログインしているユーザー情報取得
authController.get('/me', async (req: Request, res: Response) => {
  try {
    if (req.currentUser == null) {
      res.status(200).json(null);
      return;
    }

    const { password, ...userWithoutPassword } = req.currentUser;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('ユーザー情報取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default authController;
