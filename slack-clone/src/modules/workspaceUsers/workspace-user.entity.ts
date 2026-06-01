
// /modules/workspaceUsers/workspace-user.entity.ts

// どのユーザーが、どのワークスペースに属しているか
// id: 1、workspaceId 2、の時、idが１のユーザーが、
// workspaceIdが2のワークスペースに参加している

export class WorkspaceUser {
  id!: string;
  userId!: string;
  workspaceId!: string;

  constructor(data: WorkspaceUser){
    Object.assign(this, data);
  }
}

