

// Workspaceに関するエンティティ

import { Channel } from "../channels/channel.entity";

// エンティティ
// 意味: アプリの中で存在しつづけるもの
// → 型であったり、DBの1行レコードの型であるの

// ワークスペース > チャンネル

// 👉 チャンネルのエンティティ
// export class Channel {
//   id!: string;
//   name!: string;
  
//   constructor(data: Channel) {
//     Object.assign(this, data);
//   }
// }

export class Workspace {
  id!: string;
  name!: string;
  channels!: Channel[];

  constructor(data: Workspace) {
    Object.assign(this, data);
    // 取得したチャンネル1つ1つに型を持たせていく。
    this.channels = data.channels.map(channel => new Channel(channel));
  }
}



