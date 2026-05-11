
// datasource.tsx
// → データベースをどう扱うか全部まとめた設定書のようなもの
// ✅ TypeORMに対して,
//   「どのDBを使う？」
//   「Entityどこ？」
//   「Migrationどこ？」
//   「ログ出す？」
//   「同期する？」
// などを設定している

// Node.js環境
//   │
//   ├─ Express
//   │     └─ HTTP処理
//   │
//   └─ DataSource
//         └─ DB処理

import { DataSource } from 'typeorm';


export default new DataSource({ // DB操作オブジェクトを作る
  migrationsTableName: 'migrations', // Migration履歴を保存するテーブル名
  type: 'sqlite', // DBの種類。他には、postgres、mysql、mariadbなどがある
  database: './data/slack-clone.sqlite', // SQLiteの保存場所
  synchronize: false, // trueならEntityを見て自動でテーブルを変更。
  migrationsRun: true, // サーバー起動時に：未実行migrationを自動実行
                       // initialize() → migration確認 → 必要ならDB更新。これを自動でやる  
  logging: ['query', 'error', 'log'], // ログ出力確認。
                                      // SELECT * FROM usersみたいなSQLをコンソールに表示。
                                      // デバックしやすくなる。ターミナルに出力
  // エンティティファイルの置き場 → DBテーブルの設計図
  entities: [process.env.DB_TYPEORM_ENTITIES || 'src/**/*.entity.ts'], 
  // Migrationファイルの置き場所→ DB変更履歴
  migrations: [process.env.DB_TYPEORM_MIGRATIONS || 'src/migration/**/*.ts'], 
  // DBイベント監視
  // 例えば：User保存された！時に処理実行。
  subscribers: [process.env.DB_TYPEORM_SUBSCRIBERS || 'src/subscriber/**/*.ts'],
});
