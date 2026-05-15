
// /module/workspace-users/workspace-user.controller.ts

// このワークスペースに、複数のユーザーをメンバーとして追加する処理

// どのワークスペースにどのユーザーが参加しているかを表すテーブル

import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { WorkspaceUser } from './workspace-user.entity';
import { Auth } from '../../lib/auth';
import { Workspace } from '../workspaces/workspace.entity';
import { User } from '../users/user.entity';

const workspaceUserController = Router();
const workspaceUserRepository = datasource.getRepository(WorkspaceUser);
const workspaceRepository = datasource.getRepository(Workspace);
const userRepository = datasource.getRepository(User);

// 複数のユーザーをワークスペースに追加
workspaceUserController.post('/:workspaceId', Auth, async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params; // ワークスペースのId
    const { userIds } = req.body; // ワークスペースに入れるユーザーのId

    if(!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({ message: 'ユーザーIDの配列が必要です' });
      return;
    }

    // ワークスペースの存在確認
    const workspace = await workspaceRepository.findOne({
      where: { id: workspaceId },
    });

    if(!workspace) {
      res.status(404).json({ message: 'ワークスペースが見つかりません' });
      return;
    }

    // ユーザーが存在するか確認
    const users = await userRepository.find({
      where: userIds.map((id) => ({ id })),
    });

    if(users.length !== userIds.length) {
      res.status(400).json({ message: '一部のユーザーが存在しません' });
      return;
    }

    // 既存のワークスペースユーザーを取得
    // → すでに登録済みのユーザーを探す
    const existingWorkspaceUsers = await workspaceUserRepository.find({
      where: userIds.map((userId) => ({
        userId,
        workspaceId,
      })),
    });

    // すでに登録済みのユーザーのId
    const existingUserIds = existingWorkspaceUsers.map((wu) => wu.userId);

    // まだ追加されていないユーザーIdだけを抽出
    const newUserIds = userIds.filter((id) => !existingUserIds.includes(id));

    if (newUserIds.length === 0) {
      res.status(400).json({
        message:
          '指定されたすべてのユーザーは既にワークスペースに追加されています',
      });
      return;
    }

    // 新しいワークスペースユーザーを作成。新しいユーザーを登録する処理
    const workspaceUsers = newUserIds.map((userId) => ({
      userId,
      workspaceId,
    }));

    const createdWorkspaceUsers = await workspaceUserRepository.save(workspaceUsers);

    res.status(201).json({
      message: `${createdWorkspaceUsers.length}人のユーザーをワークスペースに追加しました`,
      workspaceUsers: createdWorkspaceUsers,
    });
  } catch (error) {
    console.error('ワークスペースユーザー作成エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default workspaceUserController;