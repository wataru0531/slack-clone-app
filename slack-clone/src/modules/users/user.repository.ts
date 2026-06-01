
// /modules/users/user.repository.ts

import api from "../../lib/api"
import { User } from "./user.entity";


// ユーザーに関するリポジトリー

export const userRepository = {
  // ✅ 自分以外のユーザーを返す処理
  async find(keyword: string): Promise<User[]> {
    const result = await api.get("/users", { params: { keyword } }); // { keyword: keyword }
    // 👉 axiosが内部で、/users?keyword=wataru のようにurlを変換してくれる
    //    JavaScriptが裏で実行しているHTTPリクエストなので、実際のURLバーには変化はない

    return result.data.map((user: User) => new User(user));
  },


}
