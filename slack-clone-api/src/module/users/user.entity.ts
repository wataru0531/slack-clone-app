
// user.entity.ts

// エンティティ → DBテーブルの設計図
// Entity 英語の意味 ... 実体、存在、対象
// DBの世界では、管理したい対象という意味で使われている。
// 存在しているもの、意味のある存在のようなイメージ

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Workspace } from '../workspaces/workspace.entity';
import { Message } from '../messages/message.entity';
import { WorkspaceUser } from '../workspace-users/workspace-user.entity';

// ✅　TypeORN

// 👉 本来のSQLでDBを作る場合
// CREATE TABLE users (
//   id UUID,
//   name TEXT,
//   email TEXT,
//   password TEXT
// );

// 👉 TypeORMの場合
// class User でテーブル定義する。
// ⭐️ つまり、Userはusersテーブルを表すクラス。

// ✅ @Entity → このクラスはDBテーブルですという意味
@Entity()

// ✅ Userテーブルの設計図 → これをEntityと呼ぶ
export class User {  // テーブル定義開始
  @PrimaryGeneratedColumn('uuid') // 主キーを自動生成
  id: string;

  @Column() // nameカラム
  name: string; // 型はstring

  @Column()
  @Index({ unique: true }) // 重複が禁止という意味
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  // @OneToMany → 1人のUserは複数Messageを持つ。
  @OneToMany(() => Workspace, (obj) => obj.adminUser, { cascade: true })
  adminWorkspaces?: Workspace[];

  @OneToMany(() => WorkspaceUser, (obj) => obj.user, { cascade: true })
  workspaceUsers?: WorkspaceUser[];

  @OneToMany(() => Message, (message) => message.user)
  messages?: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
