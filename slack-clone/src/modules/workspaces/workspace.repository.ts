

// /workspaces/workspace.repositoty.ts

import api from "../../lib/api";
import { Workspace } from "./workspace.entity";


export const workspaceRepository = {
  // ✅ ログインしているユーザーの所属するワークスペースを返す
  // → axiosにJWTトークンを含ませているので
  async find(): Promise<Workspace[]> {
    const result = await api.get(`/workspaces`);

    return result.data.map(workspace => new Workspace(workspace))
  },

  // ✅ Workspaceを作成するAPI
  async create(name: string): Promise<Workspace>{
    const result = await api.post("/workspaces", { name });

    return new Workspace(result.data);
  },




}




