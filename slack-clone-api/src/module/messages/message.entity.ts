
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

  // ⭐️ TODO
  // ✅ ユーザーとの関係
  // → このMessageは1人のUserに属するという意味
  // () => User ... このリレーションの相手はUser、という意味
  // (user) => user.message → 
  // → User側から見たとき、このMessageはどのプロパティに入るの？」という“逆方向の定義
  //   なので、User側の定義は逆に、下記のようになっている
  //   @OneToMany(() => Message, (message) => message.user)
  @ManyToOne(() => User, (user) => user.messages)
  @Index()
  user: User;

  @Column()
  channelId: string;

  // このMessageは1つのChannelに属していて、Channelが消えたらMessageも一緒に消えるという意味
  // () => Channel ... このMessageはChannelに属する
  // (channel) => channel.messages ... channelは複数のMessagesを持つという意味
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
