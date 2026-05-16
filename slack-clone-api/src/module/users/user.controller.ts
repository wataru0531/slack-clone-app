
// module/users/user.controller.ts

// ユーザー検索API

import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { User } from './user.entity';
import { Auth } from '../../lib/auth';
import { Like, Not } from 'typeorm';

const userController = Router();
const userRepository = datasource.getRepository(User);

// ✅ ログイン中の自分以外のユーザーを、名前やメールで部分一致検索するAPI
// /users?keyword=taro
userController.get('/', Auth, async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;

    if (!keyword || typeof keyword !== 'string') {
      res.status(400).json({ message: '検索キーワードを指定してください' });
      return;
    }
    
    // DB検索
    const users = await userRepository.find({
      // where: [ 条件1, 条件2 ] ... 検索条件を定義
      // ここでは、1つの検索文字を、name と email の両方に対して使う。
      // → Google検索のようにタイトル、本文、URLなど全てから探すのと同じ
      where: [
        {
          name: Like(`%${keyword}%`),  // 名前にkeywordが含まれる。Like: 〜を含む
          id: Not(req.currentUser.id), // 自分自身は検索対象から除外。Not: 〜ではない
        },
        {
          email: Like(`%${keyword}%`), // emailに、keywordが含まれる
          id: Not(req.currentUser.id),
        },
      ],
      select: ['id', 'name', 'email', 'thumbnailUrl'], // この項目だけ返す
                                                       // → createdAt、passwordなどは返さない
      relations: ['workspaceUsers'], // Userに関連する、workspaceUsersも同時に返す
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('ユーザー検索エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default userController;
