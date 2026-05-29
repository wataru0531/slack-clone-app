
// /modules/channels/channel.repository.ts
// リポジトリ → データ置き場への受付窓口
//            ReactのUIとデータ取得を分離するためにここに置く
//            → 債務の分別を行うため
//              UI側はデータ取得方法を知らなくていい。

import api from "../../lib/api";
import { Channel } from "./channel.entity";

// チャンネルに関する処理


// export class Channel {
//   id!: string;
//   name!: string;

//   constructor(data: Channel) {
//     Object.assign(this, data);
//   }
// }

export const channelRepository = {
  // ✅ チャンネルをすべて取得
  async find(workspaceId: string): Promise<Channel[]> {
    const result = await api.get(`/channels/${workspaceId}`);
    return result.data.map((channel: Channel) => new Channel(channel));
  },
  // ✅ チェンネルを作成する
  async create(workspaceId: string, name: string): Promise<Channel> {
    const result = await api.post("/channels", { workspaceId, name });

    return new Channel(result.data);
  },
  // ✅ 削除
  async delete(channelId: string): Promise<Channel> {
    const result = await api.delete(`/channels/${channelId}`);

    return result.data.channel;
  }


}
