
// /pages/Home/MainContent/index.tsx

import { useNavigate } from "react-router-dom";
import type { Channel } from "../../../modules/channels/channel.entity";
import { channelRepository } from "../../../modules/channels/channel.repository";
import { useState } from "react";
import { messageRepository } from "../../../modules/messages/message.repository";
import { Message } from "../../../modules/messages/message.entity";

type MainContentPropsType = {
  selectedChannel: Channel;
  channels: Channel[];
  channelId: string;
  workspaceId: string;
  deleteChannel: (channelId: string) => Channel[];
  messages: Message[];
  addMessages: (_message: Message) => void;
}


function MainContent({ 
  selectedChannel,
  channels,
  channelId,
  workspaceId,
  deleteChannel, // 👉 保持しているチャンネルを更新する関数
  messages,
  addMessages, // 保持しているメッセージを更新する処理
}: MainContentPropsType) {
  const navigate = useNavigate();
  const [ content, setContent ] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  // ✅ 送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      addMessages(newMessage); // 👉 メッセージを更新

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

    if(e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit(); // 👉 ここでForm送信
    }
  }

  // ✅ messages配列を、扱いやすいように、オブジェクトの配列に変換
  // [
  //   { content: "おはよう", dateString: "2026/06/05" },
  //   { content: "こんにちは", dateString: "2026/06/05" },
  // ]
  // 👇 変換
  // [
  //   {
  //     date: "2026/06/05",
  //     messages: [
  //       { content: "おはよう" },
  //       { content: "こんにちは" }
  //     ]
  //   },
  //   {
  //     date: "2026/06/06",
  //     messages: [
  //       { content: "こんばんは" }
  //     ]
  //   },
  // ]
  const groupMessagesByDate = () => {
    const messageMap = new Map<string, Message[]>(); // 日付、メッセージの配列

    messages.forEach(message => {
      const dateKey = message.dateString; // 👉 2026/06/05に変換

      if(!messageMap.has(dateKey)) { // 👉 Mapに日付がなければ作る
        messageMap.set(dateKey, []); // 最初なので、Map {"2026/06/05" => []}
      }

      // その日付の配列に追加 👉 取得 → 追加
      messageMap.get(dateKey)!.push(message);
    });

    // console.log(messageMap.entries()); //
    return Array.from(messageMap.entries()).map(([date, messages]) => ({
      date: date,
      messages: messages
    }));
  }

  const messageGroups = groupMessagesByDate();

  // ✅ メッセージを作成する関数
  // const createMessage = async () => {
  //   try {
  //     const newMessage = await messageRepository.create(
  //       workspaceId,
  //       selectedChannel.id,
  //       content
  //     );
  //     console.log(newMessage);

  //     setContent("");

  //   } catch(error) {
  //     console.error("メッセージの作成に失敗しました。", error);
  //   }
  // }

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
        <div
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
        </div>
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
              <input type="file" style={{ display: 'none' }} accept="image/*" />

              {/* 画像を添付するボタン */}
              <button
                type="button" // type="button"ならエンターキーで発火しない
                className="action-button"
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
