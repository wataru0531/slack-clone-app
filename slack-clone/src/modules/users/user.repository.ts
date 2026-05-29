
// /modules/users/user.repository.ts

import api from "../../lib/api"
import { User } from "./user.entity";


// ユーザーに関するリポジトリー

export const userRepository = {
  // ✅ 自分以外のユーザーを返す処理
  async find(keyword: string): Promise<User[]> {
    const result = await api.get("/users", { params: { keyword } });

    return result.data.map((user: User) => new User(user));
  },


}
