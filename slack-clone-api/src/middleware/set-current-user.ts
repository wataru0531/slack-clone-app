
// /middleware/set-current-user.ts



import { Request, Response, NextFunction } from 'express';
import datasource from '../datasource';
import { User } from '../module/users/user.entity';
import { decodeJwt } from '../lib/jwt';

// ✅ リクエストからJWTトークンを取り出し、そこからログインしているユーザーデータを取得
// → req.currentUserに入れる。
// フロントのaxiosに必ずブラウザのtokenを取得して、サーバーに投げる処理をかましている。
export default async (req: Request, _res: Response, next: NextFunction) => {
  const token = _getTokenFromHeader(req); // 渡ってきたBearerトークンを取得

  if (!token) return next();

  try {
    const id = decodeJwt(token); // デコード。ユーザーidを取り出す
    const userRepository = datasource.getRepository(User);

    // DBからユーザーデータを取得
    const user = await userRepository.findOne({ where: { id } });

    if(!user) return next(); // いなければスキップ。退会済み、不正トークン、DB不整合など
    req.currentUser = user; // 👉 reqにユーザーを入れる
                            //    → 他の部分で、req.currentUser が使えるようになる
  } catch (e) {
    throw new Error('Unauthorized');
  }

  next();
};

// ✅ 渡ってきたBearerトークンを取得
const _getTokenFromHeader = (req: Request): string | undefined => {
  // Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.ZDMxNmQ4NTItZTE5NS00N2UxLWJmYzgtYTk3NzllZTU1ODI5.BWvWAx0Ym2a7_z-jtEGtfki9Gz4tPjHWVAKzYojgxJI

  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    // console.log(req.headers.authorization.split(" ")[1]);
    return req.headers.authorization.split(' ')[1];
  }
};
