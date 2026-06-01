
// /modules/workspaceUsers/workspace-user.repository.ts

import api from "../../lib/api";
import { WorkspaceUser } from "./workspace-user.entity";


export const workspaceUserRepository = {
  // ✅ 指定したワークスペースに、指定したユーザーを格納
  async create(workspaceId: string, userIds: string[]): Promise<WorkspaceUser[]> {
    const result = await api.post(`/workspace-users/${workspaceId}`, {
      userIds: userIds,
    });

    return result.data.workspaceUsers.map((workspaceUser: WorkspaceUser) => {
      return new WorkspaceUser(workspaceUser);
    });
  },

  // ✅ 


}
