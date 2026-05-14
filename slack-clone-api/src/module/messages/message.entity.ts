
// /module/messages/message.entity.ts
// メッセージを保存するためのテーブル定義


// ✅ Slackの構造
// Workspace: 会社A
//  ├─ Channel: general
//  │    ├─ Message
//  │    ├─ Message
//  │
//  ├─ Channel: dev
//       ├─ Message

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Channel } from '../channels/channel.entity';


@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true }) // 本文。nullでもOK
  content?: string;

  @Column({ nullable: true }) // 画像URL
  imageUrl?: string;

  @Column() // 投稿者のID
  userId: string;

  // ✅ ユーザーとの関係
  // → このMessageは1人のUserに属する
  @ManyToOne(() => User, (user) => user.messages)
  @Index()
  user: User;

  @Column()
  channelId: string;

  @ManyToOne(() => Channel, (channel) => channel.messages, {
    onDelete: 'CASCADE',
  })
  @Index()
  channel: Channel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
