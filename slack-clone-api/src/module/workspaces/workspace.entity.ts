import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Channel } from '../channels/channel.entity';
import { WorkspaceUser } from '../workspace-users/workspace-user.entity';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

  @Column()
  adminUserId: string;

  @ManyToOne(() => User, (adminUser) => adminUser.adminWorkspaces)
  @Index()
  adminUser?: User;

  @OneToMany(() => Channel, (channel) => channel.workspace)
  channels?: Channel[];

  @OneToMany(() => WorkspaceUser, (obj) => obj.workspace, { cascade: true })
  workspaceUsers?: WorkspaceUser[];

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;
}
