
// /module/channels/channel.entity.ts

// Slackのチャンネルを定義
// 構造
// Workspace（プロジェクト・部屋の箱）
//  - Channel（その中の部屋・トピック）
//     - Message（チャット投稿）

// ✅ Slackの構造
// Workspace: 会社A
//  ├─ Channel: general
//  │    ├─ Message
//  │    ├─ Message
//  │
//  ├─ Channel: dev
//       ├─ Message

// ここでは、チャンネルというテーブルの構造と、他テーブルとの関係を定義している


import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Workspace } from '../workspaces/workspace.entity';
import { Message } from '../messages/message.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // workspaceId → 外部キー。
  //               このチャンネルがどのワークスペースに属しているか。
  @Column()
  workspaceId: string;

  // ✅ Workspaceとの関係
  // → このChannelは1つのWorkspaceに属している
  @ManyToOne(() => Workspace, (workspace) => workspace.channels)
  @Index()
  workspace: Workspace;

  // ✅ Messageとの関係
  // → このChannelには複数のメッセージが紐づく
  // () => Message ... 関連先のテーブルはMessageです、という意味
  // (message) => message.channel ... Message側では channel というカラムでChannelと繋がっている、という意味
  @OneToMany(() => Message, (message) => message.channel, {
    cascade: true, // Channelを保存したら、関連するMessageも一緒に保存できる
                  //  TypeORMのcascade → 親のエンティティの操作をこのエンティティの操作にも伝播させる
  })
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
