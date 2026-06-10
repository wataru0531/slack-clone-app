
// lib/socket.tsx

import { io } from "socket.io-client";
import { Message } from "../modules/messages/message.entity";


// サーバー側のURL
const baseURL = import.meta.env.VITE_API_URL;

const socket = io(baseURL); // Socket接続を作る

// ✅ 通内開始
export const subscribe = (
  workspaceId: string,
  onNewMessage: (message: Message) => void,
  onDeleteMessage: (messageId: string) => void
) => {
  // ✅ サーバーに対して、workspaceId = xxx の部屋に参加します。と表示
  // emit → 情報を発信
  // on   → 情報を受信
  socket.emit("join-workspace", workspaceId); // サーバー側に送る
  // サーバー側で、socket.on("join-workspace", ...)がないので、何も起こらない？

  // ✅ メッセージ作成に関するWebSocketを登録
  // → サーバーでメッセージが作られる、
  //    io.emit('new-message', messageWithUser); が発火
  //    →こらがここで登録したコールバックが発火して全てのクライアントに通知される
  // サーバーから通知が来たら実行 → 全クライアントが実行する
  // io.emit('new-message', newMessage); 
  socket.on("new-message", (message: Message) => {
    onNewMessage(new Message(message));
  });

  // ✅ メッセージ削除に関するWebSocketを登録
  // サーバーから削除の通知が来たら実行 → 全クライアントに通知
  // io.emit('new-message', newMessage);
  socket.on("delete-message", onDeleteMessage);
}

// ✅ 通知の受信終了
export const unsubscribe = (workspaceId: string) => {
  // サーバーへ、workspaceから出ると通知
  socket.emit("leave-workspace", workspaceId);
  
  socket.off("new-message"); // イベント登録解除
  socket.off("delete-message");
}