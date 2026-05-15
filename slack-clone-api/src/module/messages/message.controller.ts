
// /module/messages/message.controller.ts
// 

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

// ✅　チャンネル内のすべてのメッセージを取得するAPI
messageController.get('/:workspaceId/:channelId', Auth, async (req: Request, res: Response) => {
    try {
      const { workspaceId, channelId } = req.params;
      // どのworkspaceの、どのchannelか

      // DBからメッセージ検索
      // あるワークスペースの中の、あるチャンネルのメッセージだけを取得
      const messages = await messageRepository.find({
        where: { channelId, channel: { workspaceId } },
        // where: {  // 👉 これと同じ
        //   channelId: channelId,
        //   channel: { workspaceId: workspaceId } 
        // },
        relations: ['user', 'channel'],
        order: { createdAt: 'DESC' }, // 降順(新しい順)
      });

      res.status(200).json(messages);
    } catch (error) {
      console.error('メッセージ取得エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  }
);

// ✅ メッセージを作成
// workspace、channelIdを特定して、特定のワークスペース、チャンネルにメッセージを投稿
messageController.post('/:workspaceId/:channelId', Auth, async (req: Request, res: Response) => {
  try {
    const { content } = req.body; // メッセージ本文
    const { workspaceId, channelId } = req.params; // どのワークスペース、チャンネルか

    // チャンネルの存在、権限をチェック
    const existingChannel = await channelRepository.findOne({
      where: {
        id: channelId, // チャンネルが存在するか
        workspaceId,   // ワークスペースが一致するか
        workspace: { workspaceUsers: { userId: req.currentUser.id } },
        // → このユーザーがそのワークスペースに所属しているか
      },
      relations: ['workspace', 'workspace.workspaceUsers'],
    });

    if(existingChannel == null) {
      res.status(404).json({ message: 'チャンネルが見つかりません' });
      return;
    }

    if(!content) {
      res.status(400).json({ message: 'メッセージ内容は必須です' });
      return;
    }

    // ✅ メッセージをDBに保存
    const message = await messageRepository.save({
      content,
      channelId,
      userId: req.currentUser.id,
    });

    // 保存したメッセージを再取得
    // → さっきのsaveは：user情報が入っていない、リレーションがないので、
    //   ユーザー情報付きで取得しなおす
    const newMessage = await messageRepository.findOne({
      where: { id: message.id },
      relations: ['user'],
    });

    // ⭐️ Socket.IOを使用してリアルタイムで新しいメッセージを全体に配信
    // → サーバー → Socket.IO → 全ユーザーの画面を更新する
    // サーバーが、new-messageというイベント名で、newMessageを全クライアントに送る
    // ⭐️ フロントでの受け取り方
    // → socket.on("new-message", (data) => { console.log(data)})
    io.emit('new-message', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('メッセージ作成エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 画像アップロードエンドポイント
messageController.post('/:workspaceId/:channelId/image', Auth, async (req: Request, res: Response) => {
  // → 特定のチャンネルに画像を投稿する。どのワークスペースでどのチャンネルか
  try {
    const { workspaceId, channelId } = req.params;

    const existingChannel = await channelRepository.findOne({
      where: {
        id: channelId, // チャンネルが存在するか
        workspaceId,   // workspaceが一致しているかどうか
        workspace: { workspaceUsers: { userId: req.currentUser.id } },
        // → このユーザーがそのワークスペースに所属しているか
      },
      relations: ['workspace', 'workspace.workspaceUsers'],
    });

    if (existingChannel == null) {
      res.status(404).json({ message: 'チャンネルが見つかりません' });
      return;
    }

    // 👉 画像をアップロード、保存先のurlを取得
    // uploads/messages といフォルダに保存
    const { fileUrl } = await upload(req, res, 'messages');

    if (fileUrl == null) {
      res.status(400).json({ message: '画像がアップロードされていません' });
      return;
    }

    // DBに保存
    const message = await messageRepository.save({
      channelId,
      userId: req.currentUser.id,
      imageUrl: fileUrl,
    });

    // メッセージの内容に、ユーザー情報を紐づける
    const messageWithUser = { ...message, user: req.currentUser };

    // Socket.IOを使用してリアルタイムで新しい画像メッセージを全クライアントに配信
    io.emit('new-message', messageWithUser);

    res.status(201).json(messageWithUser);
  } catch (error) {
    console.error('画像アップロードエラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ✅ メッセージを削除
messageController.delete('/:id', Auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // メッセージ取得、削除可能かどうかの権限チェック
    const existingMessage = await messageRepository.findOne({
      where: { 
        id, // idが一致しているか(メッセージがあるか)
        userId: req.currentUser.id // ログインしているユーザーのidと一致しているか
      },
      relations: ['channel'],
    });

    if(!existingMessage) {
      res.status(404).json({ message: 'メッセージが見つかりません' });
      return;
    }

    await messageRepository.delete(id); // 👉 削除

    // Socket.IOを使用してリアルタイムでメッセージ削除を全クライアントに配信
    io.emit('delete-message', id);

    res.status(200).json({ status: true });
  } catch (error) {
    console.error('メッセージ削除エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default messageController;
