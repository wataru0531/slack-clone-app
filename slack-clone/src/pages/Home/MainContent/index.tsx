
// /pages/Home/MainContent/index.tsx

// メインコンテンツ

import { useNavigate } from "react-router-dom";
import type { Channel } from "../../../modules/channels/channel.entity";
import { channelRepository } from "../../../modules/channels/channel.repository";
import { useRef, useState } from "react";
import { messageRepository } from "../../../modules/messages/message.repository";
import { Message } from "../../../modules/messages/message.entity";
import { useCurrentUserStore } from "../../../modules/auth/current-user.state";

type MainContentPropsType = {
  selectedChannel: Channel;
  channels: Channel[];
  channelId: string;
  workspaceId: string;
  deleteChannel: (channelId: string) => Channel[];
  messages: Message[];
  addMessages: (_message: Message) => void;
  deleteMessageById: (_messageId: string) => void;
}


function MainContent({ 
  selectedChannel,
  channels,
  channelId,
  workspaceId,
  deleteChannel, // 👉 保持しているチャンネルを更新する関数
  messages,
  addMessages, // 保持しているメッセージを更新する処理
  deleteMessageById,

}: MainContentPropsType) {
  const navigate = useNavigate();
  const [ content, setContent ] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const { currentUser } = useCurrentUserStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ 送信処理
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    if(!trimmedContent) return;

    if(isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      const newMessage = await messageRepository.create(
        workspaceId,
        selectedChannel.id,
        trimmedContent
      );
      // console.log(newMessage);
      // Message {id: 'b181200a-e962-452a-a3be-8d1355d3e192', content: 'aaa', imageUrl: null, user: User, createdAt: Thu Jun 04 2026 18:09:04 GMT+0900 (日本標準時), …}

      addMessages(newMessage); // 👉 messagesのステートを更新

      setContent("");
    } catch(error) {
      console.error("メッセージの作成に失敗しました。", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ✅ テキストエリア入力後にエンターキーを押してForm送信させる処理
  //    → textarea内でエンターキーを押すと改行されてしまうため。
  //    👉 変換後のエンターはエンターキーの押した回数に入れない
  const onKeydownTextarea = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
    // isComposing 漢字変換後のエンターはtrueを判定、発火させない
    // 229 → IME(日本語入力など)の変換処理中に押されたキーを表す特殊なキーコード
    if(e.nativeEvent.isComposing || e.keyCode === 229) return;

    // if(e.shiftKey) console.log("shiftKey")
    if(e.key === "Enter" && !e.shiftKey) { // → shift + Enterは通さない処理
      e.preventDefault();
      e.currentTarget.form?.requestSubmit(); // 👉 ここでForm送信
    }
  }

  // ✅ 画像のアップロード処理
  const uploadImage = async(e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.files); 
    // FileList {0: {name: 'yamamoto.avif', lastModified: 1779545585542, lastModifiedDate: Sat May 23 2026 23:13:05 GMT+0900 (日本標準時), webkitRelativePath: '', size: 6107, , length: 1}

    try {
      if(e.target.files === null || e.target.files[0] == null) return;
      const file = e.target.files[0];

      const newMessage = await messageRepository.uploadImage(
        workspaceId,
        selectedChannel.id,
        file
      );
      // console.log(newMessage); // Message {id: 'e29539e5-6822-47ee-ae83-beb982ca70ee', content: null, imageUrl: 'http://localhost:8888/uploads/messages/1780741995447-538365476.avif', user: User, createdAt: Sat Jun 06 2026 19:33:15 GMT+0900 (日本標準時), …}channelId: "914fa107-fe85-4e8d-b310-0f34bd246f95"content: nullcreatedAt: Sat Jun 06 2026 19:33:15 GMT+0900 (日本標準時) {}id: "e29539e5-6822-47ee-ae83-beb982ca70ee"imageUrl: "http://localhost:8888/uploads/messages/1780741995447-538365476.avif"updatedAt: "2026-06-06T10:33:15.000Z"user: User {id: '04b85ef1-c8c7-4897-90f1-89ac530e4700', name: 'yasukawa wataru', email: 'obito0531@gmail.com', workspaceUsers: undefined, thumbnailUrl: 'http://localhost:8888/uploads/account/1780479592672-668263393.avif', …}userId: "04b85ef1-c8c7-4897-90f1-89ac530e4700"dateString: (...)dateTimeString: (...)[[Prototype]]: Object

      addMessages(newMessage); // ⭐️ TODO 配列の最初に持っていきたい
    } catch(error) {
      console.error("画像のアップロードに失敗しました。", error);
    }
  }

  // ✅ 日付ごとにメッセージのオブジェクトを格納して、配列を作る
  // console.log(messages); // (7) [ Message {id: 'a716bae3-2c2c-4235-b2cc-bf0727f64069', content: 'っs', imageUrl: null, user: User, createdAt: Sat Ju, Message, Message, Message, Message, Message, Message]
  const groupMessagesByDate = () => {
    const messageMap = new Map<string, Message[]>(); // 日付、メッセージの配列
    // console.log(messageMap); // Map(0) {size: 0}

    messages.forEach(message => {
      const dateKey = message.dateString; // 👉 2026/06/05に変換
      // console.log(dateKey); // 2026/06/06

      if(!messageMap.has(dateKey)) { // 👉 Mapに日付がなければ作る
        messageMap.set(dateKey, []); // → Map {"2026/06/05" => []} の形を作る
      }
      // console.log(messageMap); // Map(2) {'2026/06/06' => Array(1), '2026/06/04' => Array(1)}

      // ✅ その日付2026/06/04の参照先の配列に、messageオブジェクトを格納していく
      // console.log(messageMap.get(dateKey));
      // (5) [
      //      Message {id: '6001fd9e-a2a1-4808-a0e5-1a8ff61a9995', content: 'done', imageUrl: null, user: User, createdAt: Thu Jun ...}, 
      //       Message, Message, Message, Message ]
      messageMap.get(dateKey)!.push(message);
    });
    // console.log(messageMap); // Map(2) {'2026/06/06' => Array(1), '2026/06/04' => Array(6)}

    // ✅ 扱いやすいオブジェクトの配列に変換する
    // console.log(messageMap.entries()); // MapIterator {'2026/06/06' => Array(1), '2026/06/04' => Array(6)}
    // console.log([...messageMap.entries()]); // (2) [['2026/06/06', Array(1)], Array(2)]
    return Array.from(messageMap.entries()).map(([date, messages]) => ({
      date: date,
      messages: messages
    }));
  }

  // 日付、messagesの配列を持ったオブジェクトの配列を取得
  const messageGroups = groupMessagesByDate();
  // console.log(messageGroups);
  // (2) [{ date: '2026/06/04', messages: [Message {id: '6001fd9e-a2a1-4808-a0e5-1a8ff61a9995', content: 'done', imageUrl: null, user: User, createdAt: Thu Jun,  ...] },  {…}]

  // ✅ 現在開いているチャンネルを削除
  const onClickDeleteChannel = async () => {
    try {
      const confirmed = window.confirm("このチャンネルを削除しますか？この操作は取り消せません。")
      // console.log(confirmed); // OKをクリックするとtrue。

      // セクション6 34
      if(!confirmed) return;

      const response = await channelRepository.delete(channelId);
        // console.log(response); // {id: 'fc1161fd-d1ce-4dcb-a977-ea988578f908', name: 'チャンネル７', workspaceId: '286d8306-bf21-4ce0-9063-b01b4807a5e7', createdAt: '2026-05-27T09:22:30.000Z', updatedAt: '2026-05-27T09:22:30.000Z'}

      const updatedChannels = deleteChannel(response.id); // 👉 保持しているチャンネルを更新する関数
      
      if(updatedChannels.length === 0) { // バックエンドでもガードしているが、フロントでもガード
        navigate("/");
        return;
      }

      navigate(`/${workspaceId}/${updatedChannels[0].id}`); // 遷移
    } catch(error) {
      console.error("チャンネルの削除に失敗しました。", error);
    }
  }

  // ✅ メッセージを1つ削除
  const deleteMessage = async (message: Message) => {
    const confirmed = window.confirm("このメッセージを削除しますか？この操作は取り消せません。");
    if(!confirmed) return;

    try {
      await messageRepository.delete(message.id);

      deleteMessageById(message.id); // 👉 ステートを更新
    } catch(error) {
      console.error("メッセージの削除に失敗しました。", error);
    }
  }

  return (
    <div className="main-content">
      <header className="channel-header">
        <div className="channel-info">
          <h2>#{ selectedChannel.name }</h2>
        </div>
        <div className="channel-actions">
          {/* 削除ボタン */}
          <button
            className="delete-channel-button"
            onClick={ onClickDeleteChannel }
            title="チャンネルを削除"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
      </header>

      {/* 中央のコンテナ */}
      <div
        className="messages-container"
        style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}
      >
        {
          messageGroups && (
            messageGroups.map((messageGroup) => {
              // console.log(messageGroup); 
              // {date: '2026/06/06', 
              //  messages: [ Message {id: '6001fd9e-a2a1-4808-a0e5-1a8ff61a9995', content: 'done', imageUrl: null, user: User, createdAt: Thu Ju...}, {}]}
              
              return(
                <div
                  key={ messageGroup.date }
                  style={{ display: 'flex', flexDirection: 'column-reverse' }}
                >
                  { // messageをさらに取り出す。
                    messageGroup.messages && 
                    messageGroup.messages.map((message) => {
                      // 👉 メッセージの投稿者をログインユーザーかどうかかを判定
                      // console.log(message); // Message {id: 'a716bae3-2c2c-4235-b2cc-bf0727f64069', content: 'っs', imageUrl: null, user: User, createdAt: Sat Jun 06 2026 17:13:32 GMT+0900 (日本標準時), …}
                      const user = message.user.id == currentUser.id ? currentUser : message.user;
                      // console.log(user);

                      return (
                        <div key={ message.id } className="message">
                          <div className="avatar">
                            <div className={`avatar-img `}>
                              <img
                                src={ user.iconUrl ?? 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'}
                                alt="Posted image"
                                className="message-image"
                              />
                            </div>
                          </div>

                          <div className="message-content">
                            <div className="message-header">
                              <span className="username">{ user.name }</span>
                              <span className="timestamp">{ message.dateTimeString }</span>

                              {/*
                                ✅ メッセージ削除ボタン
                                → ログインユーザーが投稿したメッセージしか削除できないようにする
                               */}
                              {
                                currentUser.id === message.user.id && (
                                  <button
                                    className="message-delete-button"
                                    title="メッセージを削除"
                                    onClick={() => deleteMessage(message)}
                                  >
                                    <svg
                                      viewBox="0 0 24 24"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                    >
                                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                    </svg>
                                  </button>
                                )
                              }
                              
                            </div>
                            <div className="message-text">{ message.content }</div>
                            
                            {/* 画像を表示 */}
                            {
                              message.imageUrl != null && (
                                <div className="message-image-container">
                                  <div className="message-image-wrapper">
                                    <img className="msg-image" src={ message.imageUrl } alt="Posted Image" />
                                  </div>
                                </div>
                              )
                            }

                          </div>
                        </div>
                      )
                    })
                  }

                  {/* 日付付きの区切り線 */}
                  <div className="date-divider">
                    <span>{ messageGroup.date }</span>
                  </div>
                </div>
              )
            })
          )
        }
        {/* <div
          key={1}
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
        >
          <div key={1} className="message">
            <div className="avatar">
              <div className={`avatar-img `}>
                <img
                  src={
                    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'
                  }
                  alt="Posted image"
                  className="message-image"
                />
              </div>
            </div>

            <div className="message-content">
              <div className="message-header">
                <span className="username">{'test'}</span>
                <span className="timestamp">{'2025/05/11 12:23'}</span>
                <button
                  className="message-delete-button"
                  title="メッセージを削除"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="currentColor"
                  >
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
              </div>
              <div className="message-text">{'test'}</div>
            </div>
          </div>
          <div className="date-divider">
            <span>{'2025/05/11'}</span>
          </div>
        </div> */}
      </div>
      <div className="message-input-container">
        <div className="message-input-wrapper">

          <form onSubmit={ handleSubmit }>
            {/* メッセージ入力欄 */}
            <textarea
              className="message-input" 
              placeholder="Message"
              disabled={ isSubmitting }
              value={ content }
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              onKeyDown={ onKeydownTextarea } // 変換する時のエンターは、エンターに入れない
            />

            <div className="image-upload">

              {/* 
                画像用のinput → UI的に見せたくないので、非表示
              */}
              <input 
                type="file" 
                style={{ display: 'none' }} 
                accept="image/*"
                ref={ fileInputRef }
                onChange={ uploadImage }
              />

              {/* 👉 画像送信用ボタン */}
              <button
                type="button" // type="button"ならエンターキーで発火しない
                className="action-button"
                onClick={() => fileInputRef.current?.click() }
              >
                <svg
                  viewBox="0 0 20 20"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* 送信ボタン */}
              <button
                type="submit"
                className="action-button"
                disabled={ !content.trim() || isSubmitting }
              >
                <svg
                  viewBox="0 0 20 20"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M17.447 9.106a1 1 0 000 1.788l-14 7a1 1 0 01-1.409-1.169l1.429-5A1 1 0 014.429 11H9a1 1 0 100-2H4.429a1 1 0 01-.962-.725l-1.428-5a1 1 0 011.408-1.17l14 7z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MainContent;
