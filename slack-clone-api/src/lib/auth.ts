
// /lib/auth.ts

import e, { Request, Response, NextFunction } from 'express';

// ✅ ログインしていないユーザーのアクセスをここで止めるガード。ログインしている人だけを通す
export const Auth = (req: Request, _: Response, next: NextFunction) => {
  if(req.currentUser == null) return next(new Error('Unauthorized user'));
  // return すると実行が終わり次の関数の処理へは進まない。
  // ここではnext(error)を呼び、Expressのエラー処理フローへ進める

  next(); // 次の処理に進めてくださいという合図
};
