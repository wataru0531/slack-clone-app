import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { Channel } from './channel.entity';
import { Auth } from '../../lib/auth';
import { WorkspaceUser } from '../workspace-users/workspace-user.entity';

const channelController = Router();
const channelRepository = datasource.getRepository(Channel);
const workspaceUserRepository = datasource.getRepository(WorkspaceUser);

// ワークスペース内のすべてのチャンネルを取得
channelController.get(
  '/:workspaceId',
  Auth,
  async (req: Request, res: Response) => {
    try {
      const { workspaceId } = req.params;

      const channels = await channelRepository.find({
        where: { workspaceId },
        order: { createdAt: 'ASC' },
      });

      res.status(200).json(channels);
    } catch (error) {
      console.error('チャンネル取得エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  }
);

// 特定のチャンネルを取得
channelController.get('/:id', Auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const channel = await channelRepository.findOne({
      where: { id },
    });

    if (!channel) {
      res.status(404).json({ message: 'チャンネルが見つかりません' });
      return;
    }

    res.status(200).json(channel);
  } catch (error) {
    console.error('チャンネル取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// チャンネルを作成
channelController.post('/', Auth, async (req: Request, res: Response) => {
  try {
    const { name, workspaceId } = req.body;

    if (!name) {
      res.status(400).json({ message: 'チャンネル名は必須です' });
      return;
    }

    if (!workspaceId) {
      res.status(400).json({ message: 'ワークスペースIDは必須です' });
      return;
    }

    const channel = await channelRepository.save({
      name,
      workspaceId,
    });

    res.status(201).json(channel);
  } catch (error) {
    console.error('チャンネル作成エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// チャンネルを削除
channelController.delete('/:id', Auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingChannel = await channelRepository.findOne({
      where: { id },
    });

    if (!existingChannel) {
      res.status(404).json({ message: 'チャンネルが見つかりません' });
      return;
    }

    // ユーザーがワークスペースに所属しているか確認
    const isWorkspaceMember = await workspaceUserRepository.findOne({
      where: {
        workspaceId: existingChannel.workspaceId,
        userId: req.currentUser.id,
      },
    });

    if (!isWorkspaceMember) {
      res
        .status(403)
        .json({ message: 'このチャンネルを削除する権限がありません' });
      return;
    }

    // ワークスペース内のチャンネル数を確認
    const channelCount = await channelRepository.count({
      where: { workspaceId: existingChannel.workspaceId },
    });

    // チャンネルが1つしかない場合は削除できないようにする
    if (channelCount <= 1) {
      res.status(400).json({
        message: 'ワークスペースには少なくとも1つのチャンネルが必要です',
      });
      return;
    }

    await channelRepository.delete(id);

    res.status(200).json({ message: 'チャンネルを削除しました' });
  } catch (error) {
    console.error('チャンネル削除エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default channelController;
