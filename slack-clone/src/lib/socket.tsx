

// lib/socket.tsx

import { io } from "socket.io-client";
import type { Message } from "../modules/messages/message.entity";


// サーバー側のURL
const baseURL = import.meta.env.VITE_API_URL;

const socket = io(baseURL); // Socket接続を作る


export const subscribe = (
  workspaceId: string,
  onNewMessage: (message: Message) => void,
  onDeleteMessage: (messageId: string) => void
) => {
  // emit → 情報を発信
  // on   → 情報を受信
  socket.emit("join-workspace", workspaceId); // サーバー側に送る

  // サーバーから通知 io.emit('new-message', newMessage); 
  socket.on("new-message", (message: Message) => {
    onNewMessage(message);
  });

  // サーバーから削除の通知　io.emit('new-message', newMessage);
  socket.on("delete-message", onDeleteMessage);
}

// ✅ 
export const unsubscribe = (workspaceId: string) => {
  socket.emit("leave-workspace", workspaceId);
  
  socket.off("new-message"); // 
  socket.off("delete-message");
}