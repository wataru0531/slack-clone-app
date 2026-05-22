

// channel.entity.ts

// ワークスペース > チャンネル に関するエンティティ

export class Channel {
  id!: string;
  name!: string;
  
  constructor(data: Channel) {
    Object.assign(this, data);
  }
}










