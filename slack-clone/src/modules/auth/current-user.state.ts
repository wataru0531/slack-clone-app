

// /modules/auth/current-user.state.ts

// ✅ ユーザーに関する状態を管理

import { atom, useAtom } from "jotai";
import type { User } from "../users/user.entity";

// export class User {
//   id!: string;
//   name!: string;
//   email!: string;
//   // password!: string; // 👉 パスワードはセキュリティ上危ないので返ってこないようにする
//   thumbnailUrl!: string;

//   constructor(data: User) {
//     // 渡されたデータを、このクラスの中にそのままコピーしている
//     Object.assign(this, data);
//   }
// }

const currentUserAtom = atom<User>(); // これ単位1つで管理

// ✅ カスタムフック化して、ログインユーザー、更新用関数を取得
export const useCurrentUserStore = () => {

  const [ currentUser, setCurrentUser ] = useAtom(currentUserAtom);

  return { currentUser, setCurrentUser };
}