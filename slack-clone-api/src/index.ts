
// index.ts

// WebSocket ... 双方向通信
// 通常のHTTP通信の場合 → リクエストからのレスポンスをお互いで試合って、毎回接続 → 毎回切断の繰り返し
// WebSocketの場合 → 一回接続すると、接続を維持して、いつでも双方向での送信が可能
//                  つまり、相手にメッセージを送ったらリロードしなくても送ったメッセージが相手の画面に表示される
//                  👉 サーバーが自動で相手にメッセージを送る
//                  Notion、Googleドキュメントなど

// ここでは、HTTPサーバーでExpresサーバーをラップして、リクエスト処理はExpressに任せる一方で、
// HTTPサーバーを作っているのはWebSocket.IOを使えるようにしている。

//               HTTP通信
// ブラウザ  ─────────────────→ Node HTTP Server
//                                   │
//                                   ├─ 通常HTTP → Express(app)
//                                   │               ├─ routing
//                                   │               ├─ middleware
//                                   │               └─ JSON処理
//                                   │
//                                   └─ WebSocket → Socket.IO

// ✅ Node.js HTTP Server
//   ・TCP通信受付
//   ・HTTP通信受付
//   ・ポート監視
//   ・WebSocket upgrade

// ✅ Express(app)
//   ・routing
//   ・middleware
//   ・req/res の便利化
//   ・JSON parsing

// ⭐️ →  const httpServer = createServer(app); ここで同期させる

// ① フロントからリクエスト送信
// ② HTTP Serverが受信 → リクエストはExpressに任している
// ③ Express(app)実行
// ④ app.use('/auth') に一致
// ⑤ authController に渡す
// ⑥ authController.post('/signup')に一致して実行


import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import datasource from './datasource';
import workSpaceController from './module/workspaces/workspace.controller';
import authController from './module/auth/auth.controller';
import setCurrentUser from './middleware/set-current-user';
import channelController from './module/channels/channel.controller';
import messageController from './module/messages/message.controller';
import accountController from './module/account/account.controller';
import workspaceUserController from './module/workspace-users/workspace-user.controller';
import userController from './module/users/user.controller';

require('dotenv').config();
const port = 8888;
const app: Express = express(); // express初期化。
const httpServer = createServer(app); // HTTP通信が来たら、Express(app) に処理させるという意味
                                      // → Express単体ではSocket.IOを直接扱いにくいので、
                                      //   NodeのHTTPサーバーに変換
                                      // ExpressはNode.jsのHTTPサーバーを便利に扱えるラッパー
                                      // → HTTPサーバーにExpressが乗っかった感じ

// ✅ Socket.IOのサーバー
// Expressサーバーに WebSocket(リアルタイム通信)機能を追加
// Socket.IOは、HTTPサーバーそのものにアクセスしたい。
// → なので本物のHTTPサーバーを作る必要があった。
const io = new Server(httpServer, { 
  cors: {
    origin: '*', // 全てのオリジンを許可。本番環境では適切なオリジンに変更してください
    methods: ['GET', 'POST'], // Socket.IO内部で必要な通信を許可。
  },
});

export { io }; // ソケット接続を他のモジュールで利用できるようにエクスポート


// ✅ JSONミドルウェアの設定
// → httpServerは「通信を受けるだけ」で、ルーティングや middleware の機能を持っていない
app.use(express.json());
app.use(cors());
app.use(setCurrentUser); // 👉 

// 静的ファイル配信の設定
app.use('/uploads', express.static('uploads'));

// ルーティングの設定
app.use('/auth', authController);
app.use('/account', accountController);
app.use('/workspaces', workSpaceController);
app.use('/channels', channelController);
app.use('/messages', messageController);
app.use('/workspace-users', workspaceUserController);
app.use('/users', userController);

io.on('connection', (socket) => {
  console.log('クライアント接続: ', socket.id);

  socket.on('disconnect', () => {
    console.log('クライアント切断: ', socket.id);
  });
});

datasource
  .initialize()
  .then(async (connection) => {
    httpServer.listen(port, () =>
      // Express が組み込まれた HTTPサーバー」が起動という意味
      // → リクエストが来たら Express(app) に渡す
      console.log(`Server listening on port ${port}!`)
    );
  })
  .catch((error) => console.error(error));

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});
