
// /lib/account.controller.ts

import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { User } from '../users/user.entity';
import { Auth } from '../../lib/auth';
import { upload } from '../../lib/file-uploader';

const accountController = Router();
const userRepository = datasource.getRepository(User);


// ✅ ログイン中ユーザーのプロフィール（名前・アイコン画像）を更新するAPI
// const result = await api.putForm("/account/profile", { name, file });
// HTTP的には、
// PUT /account/profile
// Content-Type: multipart/form-data が送られる。
// サーバーから見ると、purFormでリクエストを受けても、putで受けることが可能
accountController.put('/profile', Auth, async (req: Request, res: Response) => {
  // Auth → ミドルウェア。ログインしている人だけを通す
  
  try {
    const userId = req.currentUser.id; 

    const user = await userRepository.findOne({ // ログインユーザーを取得
      where: { id: userId },
    });

    if(user == null) {
      res.status(404).json({ message: 'ユーザーが見つかりません' });
      return;
    }

    // ✅ アップロード処理。
    // 画像までのパス、データ(nameなど)を返す
    const { fileUrl, body } = await upload(req, res, 'account');

    const updatedUser = await userRepository.save({ // DBの更新
      ...user,
      name: body.name, // 名前更新
      thumbnailUrl: fileUrl ?? user.thumbnailUrl, // アイコン更新
    });

    // パスワードを除いたユーザー情報を返す
    const { password, ...userWithoutPassword } = updatedUser; // 分割代入でpasswordのみ外す
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default accountController;
