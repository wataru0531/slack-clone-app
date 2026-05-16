
// /module/workspace-users/workspace-user.entity.ts
// ✅ ユーザーとワークスペースの紐づけテーブル
// どのワークスペースにどのユーザーが参加しているかを表すテーブル

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Workspace } from '../workspaces/workspace.entity';

// ✅ @Entity
// 意味 → このクラスはDBのテーブルです
// これを付けると：
// 👉 TypeORMが「WorkspaceUserテーブルとして扱う」と認識する
@Entity()
export class WorkspaceUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  // () => User ... WorkspaceUser は「Userに所属する
  // (user) => user.workspaceUsers ... Userは「複数の WorkspaceUser を持つ
  //                                   workspaceUsersと複数形になっているのは、
  //                                   複数のworkspaceUserを持つから
  @ManyToOne(() => User, (user) => user.workspaceUsers)
  @Index() // ✅ このカラムを検索しやすくするための“索引（インデックス）”をDBに作る
  user: User;

  @Column()
  workspaceId: string;

  // WorkspaceUserは、Workspaceに属する
  // workspaceは、workspaceUserを複数持つ
  @ManyToOne(() => Workspace, (workspace) => workspace.workspaceUsers)
  @Index()
  workspace: Workspace;

  @CreateDateColumn()
  createdAt: Date;
}
