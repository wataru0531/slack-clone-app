import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { User } from '../users/user.entity';
import { Auth } from '../../lib/auth';
import { upload } from '../../lib/file-uploader';

const accountController = Router();
const userRepository = datasource.getRepository(User);

accountController.put('/profile', Auth, async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id;

    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (user == null) {
      res.status(404).json({ message: 'ユーザーが見つかりません' });
      return;
    }

    const { fileUrl, body } = await upload(req, res, 'account');

    const updatedUser = await userRepository.save({
      ...user,
      name: body.name,
      thumbnailUrl: fileUrl ?? user.thumbnailUrl,
    });

    // パスワードを除いたユーザー情報を返す
    const { password, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default accountController;
