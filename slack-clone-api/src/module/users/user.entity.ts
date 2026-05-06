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

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

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
