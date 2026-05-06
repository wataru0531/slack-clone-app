import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { Message } from './message.entity';
import { Auth } from '../../lib/auth';
import { Channel } from '../channels/channel.entity';
import { upload } from '../../lib/file-uploader';
import { io } from '../../index';

const messageController = Router();
const messageRepository = datasource.getRepository(Message);
const channelRepository = datasource.getRepository(Channel);

// チャンネル内のすべてのメッセージを取得
messageController.get(
  '/:workspaceId/:channelId',
  Auth,
  async (req: Request, res: Response) => {
    try {
      const { workspaceId, channelId } = req.params;

      const messages = await messageRepository.find({
        where: { channelId, channel: { workspaceId } },
        relations: ['user', 'channel'],
        order: { createdAt: 'DESC' },
      });

      res.status(200).json(messages);
    } catch (error) {
      console.error('メッセージ取得エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  }
);

// メッセージを作成
messageController.post(
  '/:workspaceId/:channelId',
  Auth,
  async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      const { workspaceId, channelId } = req.params;

      const existingChannel = await channelRepository.findOne({
        where: {
          id: channelId,
          workspaceId,
          workspace: { workspaceUsers: { userId: req.currentUser.id } },
        },
        relations: ['workspace', 'workspace.workspaceUsers'],
      });

      if (existingChannel == null) {
        res.status(404).json({ message: 'チャンネルが見つかりません' });
        return;
      }

      if (!content) {
        res.status(400).json({ message: 'メッセージ内容は必須です' });
        return;
      }

      const message = await messageRepository.save({
        content,
        channelId,
        userId: req.currentUser.id,
      });

      const newMessage = await messageRepository.findOne({
        where: { id: message.id },
        relations: ['user'],
      });

      // Socket.IOを使用してリアルタイムで新しいメッセージを全体に配信
      io.emit('new-message', newMessage);

      res.status(201).json(newMessage);
    } catch (error) {
      console.error('メッセージ作成エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  }
);

// 画像アップロードエンドポイント
messageController.post(
  '/:workspaceId/:channelId/image',
  Auth,
  async (req: Request, res: Response) => {
    try {
      const { workspaceId, channelId } = req.params;

      const existingChannel = await channelRepository.findOne({
        where: {
          id: channelId,
          workspaceId,
          workspace: { workspaceUsers: { userId: req.currentUser.id } },
        },
        relations: ['workspace', 'workspace.workspaceUsers'],
      });

      if (existingChannel == null) {
        res.status(404).json({ message: 'チャンネルが見つかりません' });
        return;
      }
      const { fileUrl } = await upload(req, res, 'messages');
      if (fileUrl == null) {
        res.status(400).json({ message: '画像がアップロードされていません' });
        return;
      }
      const message = await messageRepository.save({
        channelId,
        userId: req.currentUser.id,
        imageUrl: fileUrl,
      });

      const messageWithUser = { ...message, user: req.currentUser };

      // Socket.IOを使用してリアルタイムで新しい画像メッセージを全体に配信
      io.emit('new-message', messageWithUser);

      res.status(201).json(messageWithUser);
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  }
);

// メッセージを削除
messageController.delete('/:id', Auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingMessage = await messageRepository.findOne({
      where: { id, userId: req.currentUser.id },
      relations: ['channel'],
    });

    if (!existingMessage) {
      res.status(404).json({ message: 'メッセージが見つかりません' });
      return;
    }

    await messageRepository.delete(id);

    // Socket.IOを使用してリアルタイムでメッセージ削除を全体に配信
    io.emit('delete-message', id);

    res.status(200).json({ status: true });
  } catch (error) {
    console.error('メッセージ削除エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default messageController;
