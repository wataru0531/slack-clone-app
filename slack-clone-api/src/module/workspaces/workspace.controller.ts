import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { Workspace } from './workspace.entity';
import { Auth } from '../../lib/auth';
import { WorkspaceUser } from '../workspace-users/workspace-user.entity';
import { Channel } from '../channels/channel.entity';

const workSpaceController = Router();
const workspaceRepository = datasource.getRepository(Workspace);
const workspaceUserRepository = datasource.getRepository(WorkspaceUser);
const channelRepository = datasource.getRepository(Channel);
// ユーザーが所属するワークスペースを取得
workSpaceController.get('/', Auth, async (req: Request, res: Response) => {
  try {
    const workspaces = await workspaceRepository.find({
      where: { workspaceUsers: { userId: req.currentUser.id } },
      relations: ['workspaceUsers', 'channels'],
    });

    res.status(200).json(workspaces);
  } catch (error) {
    console.error('ワークスペース取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 特定のワークスペースを取得
workSpaceController.get('/:id', Auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const workspace = await workspaceRepository.findOne({
      where: { id },
    });

    if (!workspace) {
      res.status(404).json({ message: 'ワークスペースが見つかりません' });
      return;
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.error('ワークスペース取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ワークスペースを作成
workSpaceController.post('/', Auth, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: 'ワークスペース名は必須です' });
      return;
    }

    // ワークスペースを作成
    const workspace = await workspaceRepository.save<Workspace>({
      name,
      adminUserId: req.currentUser.id,
    });

    // 最初の一つのチャンネルを作成
    const channel = await channelRepository.save({
      name: 'general',
      workspaceId: workspace.id,
    });

    // 作成者をワークスペースのメンバーとして追加
    await workspaceUserRepository.save({
      userId: req.currentUser.id,
      workspaceId: workspace.id,
    });

    res.status(201).json({ ...workspace, channels: [channel] });
  } catch (error) {
    console.error('ワークスペース作成エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ワークスペースを更新
workSpaceController.patch('/:id', Auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: 'ワークスペース名は必須です' });
      return;
    }

    const existingWorkspace = await workspaceRepository.findOne({
      where: { id, adminUserId: req.currentUser.id },
    });
    if (!existingWorkspace) {
      res.status(404).json({ message: 'ワークスペースが見つかりません' });
      return;
    }

    await workspaceRepository.update(id, { name });

    const workspace = await workspaceRepository.findOne({
      where: { id },
    });

    res.status(200).json(workspace);
  } catch (error) {
    console.error('ワークスペース更新エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ワークスペースを削除
workSpaceController.delete(
  '/:id',
  Auth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const existingWorkspace = await workspaceRepository.findOne({
        where: { id, adminUserId: req.currentUser.id },
      });
      if (!existingWorkspace) {
        res.status(404).json({ message: 'ワークスペースが見つかりません' });
        return;
      }

      await workspaceRepository.delete(id);

      res.status(200).json({ message: 'ワークスペースを削除しました' });
    } catch (error) {
      console.error('ワークスペース削除エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  }
);

export default workSpaceController;
