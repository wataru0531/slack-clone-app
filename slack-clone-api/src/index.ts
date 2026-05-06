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
const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // 本番環境では適切なオリジンに変更してください
    methods: ['GET', 'POST'],
  },
});

// ソケット接続を他のモジュールで利用できるようにエクスポート
export { io };

// JSONミドルウェアの設定
app.use(express.json());
app.use(cors());
app.use(setCurrentUser);

// 静的ファイル配信の設定
app.use('/uploads', express.static('uploads'));

// ルートの設定
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
      console.log(`Server listening on port ${port}!`)
    );
  })
  .catch((error) => console.error(error));

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});
