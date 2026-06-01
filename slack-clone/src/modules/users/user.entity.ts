
// modules/users/user.entity.ts

import { WorkspaceUser } from "../workspaceUsers/workspace-user.entity";

// userに関する型、クラス

// ⭐️ APIやDBから取ってきたユーザーデータを、
// 扱いやすい“型付きオブジェクト”に変換するためのクラス

// 👇 クラスにするメリット
// メソッドを持たせたい
// ユーザー状態を判定する処理
// 権限チェックの処理
// フォーマット処理
// これらを持たすことができるからクラスか

export class User {
  id!: string;
  name!: string;
  email!: string;
  // password!: string; // 👉 パスワードはセキュリティ上危ないので返ってこないようにする
  workspaceUsers?: WorkspaceUser[];
  thumbnailUrl!: string;

  constructor(data: User) {
    // 渡されたデータを、このクラスの中にそのままコピーしている
    Object.assign(this, data);
    this.workspaceUsers = data.workspaceUsers?.map((workspaceUser) => new WorkspaceUser(workspaceUser))
  }

  // ゲッター → user.iconUrlでreturnする
  get iconUrl(){
    return (
      this.thumbnailUrl || "/dummy-icon.avif"
    )
  }
}

// 👉 使い方
// new User({
//   id: "1",
//   name: "Taro",
//   email: "taro@test.com",
//   thumbnailUrl: "/img.png"
// })

// 👇 こうすると内部では、

// this.id = "1"
// this.name = "Taro"
// this.email = "taro@test.com"
// this.thumbnailUrl = "/img.png"

// になるイメージ。

// ✅ クラスにしないパターン
// type User = {
//   id: string;
//   name: string;
//   email: string;
//   thumbnailUrl: string;
// };