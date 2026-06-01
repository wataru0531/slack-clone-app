
// /modules/account/account.repository.ts

import api from "../../lib/api";
import { User } from "../users/user.entity";


export const accountRepository = {
  // ✅ プロフィールを変更するAPI
  async updateProfile(name: string, file?: File) {
    const result = await api.putForm("/account/profile", { name, file });

    return new User(result.data); // 変更後のユーザーデータ
  },

}


// export class User {
//   id!: string;
//   name!: string;
//   email!: string;
//   workspaceUsers?: WorkspaceUser[];
//   thumbnailUrl!: string;

//   constructor(data: User) {
//     Object.assign(this, data);
//     this.workspaceUsers = data.workspaceUsers?.map((workspaceUser) => new WorkspaceUser(workspaceUser))
//   }

//   get iconUrl(){
//     return (
//       this.thumbnailUrl || "/dummy-icon.avif"
//     )
//   }
// }