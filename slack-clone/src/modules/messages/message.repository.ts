
// /modules/messages/message.repository.ts

import api from "../../lib/api";
import { Message } from "./message.entity";

// export class Message {
//   id!: string;
//   content!: string;
//   imageUrl?: string;
//   user!: User; // 送信したユーザー
//   createdAt!: Date;

//   constructor(data: Message) {
//     Object.assign(this, data);

//     // data.createdAt → APIから返ってきた時はただの文字列なので、Date型にします。
//     this.createdAt = new Date(data.createdAt);

//     if(data.user != null) {
//       // data.userもただのオブジェクトなので、User型にする
//       this.user = new User(data.user); 
//     }
//   }
// }

export const messageRepository = {
  // ✅ メッセージを取得
  async find(workspaceId: string, channelId: string): Promise<Message[]> {
    const result = await api.get(`/messages/${workspaceId}/${channelId}`);

    return result.data.map((message: Message) => new Message(message));
  },

  // ✅ メッセー時を作成
  async create(
    workspaceId: string,
    channelId: string,
    content: string
  ): Promise<Message> {
    const result = await api.post(`/messages/${workspaceId}/${channelId}`, {
      content: content,
    });
    
    return new Message(result.data); // Messageの型にして返す
  },
  
  // ✅ 画像の送信
  // const newMessage = await messageRepository.uploadImage(
  //   workspaceId,
  //   selectedChannel.id,
  //   file
  // );
  async uploadImage(
    workspaceId: string,
    channelId: string, 
    file: File
  ) {
    // postForm → Content-Type: multipart/form-data で送信するためのメソッド
    //            画像はFileオブジェクトなので、JSONには変換できない
    // postは、Content-Type: application/jsonで画像などは添付できないため、postFormを使う
    // application/jsonはテキストや数値を扱う
    const result = await api.postForm(`/messages/${workspaceId}/${channelId}/image`, { 
        file: file,
      }
    );
    
    return new Message(result.data);
  },

  // ✅ メッセージの削除
  async delete(messageId: string): Promise<boolean> {
    await api.delete(`/messages/${messageId}`);

    return true;
  }



}

