

// modules/messages/message.entity.ts

// ✅ メッセージに関するエンティティ

import { User } from "../users/user.entity";


// export class User {
//   id!: string;
//   name!: string;
//   email!: string;
//   // password!: string; // 👉 パスワードはセキュリティ上危ないので返ってこないようにする
//   workspaceUsers?: WorkspaceUser[];
//   thumbnailUrl!: string;

//   constructor(data: User) {
//     // 渡されたデータを、このクラスの中にそのままコピーしている
//     Object.assign(this, data);
//     this.workspaceUsers = data.workspaceUsers?.map((workspaceUser) => new WorkspaceUser(workspaceUser))
//   }

//   // ゲッター → user.iconUrlでreturnする
//   get iconUrl(){
//     return (
//       this.thumbnailUrl || "/dummy-icon.avif"
//     )
//   }
// }


export class Message {
  id!: string;
  content!: string;
  imageUrl?: string;
  user!: User; // 送信したユーザー
  createdAt!: Date;

  constructor(data: Message) {
    Object.assign(this, data);

    // data.createdAt → APIから返ってきた時はただの文字列なので、Date型にします。
    this.createdAt = new Date(data.createdAt);

    if(data.user != null) {
      // data.userもただのオブジェクトなので、User型にする
      this.user = new User(data.user); 
    }
  }

  // ✅ 日付を、2026/06/05 の型に変換
  get dateString() {
    return this.createdAt.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }


}






