
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
  }



}

