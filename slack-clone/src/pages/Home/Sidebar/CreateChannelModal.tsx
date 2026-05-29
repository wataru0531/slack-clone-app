
// /pages/Home/Sidebar/CreateChannelModal.tsx

import { useState } from "react";
import { useUiStore } from "../../../modules/ui/ui.state";

type CreateChannelModalProps = {
  createChannel: (name: string) => Promise<void>; // チャンネル作成関数
  isCreatingChannelLoading: boolean; // ローディング
  createChannelError: string; // エラー
}


function CreateChannelModal({ 
  createChannel, 
  isCreatingChannelLoading,
  createChannelError 
}: CreateChannelModalProps) {
  const { showCreateChannelModal, setShowCreateChannelModal } = useUiStore();
  const [ channelName, setChannelName ] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await createChannel(channelName);
    setChannelName("");
  }

  return (
    <div 
      className="profile-modal-overlay"
      onClick={() => setShowCreateChannelModal(false)}
    >
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        
        <form onSubmit={ handleSubmit }>
          <div className="profile-modal-header">
            <h2>新しいチャンネルを作成</h2>
          </div>

          <div className="profile-modal-content">
            <div className="profile-form">
              <div className="form-group">
                <label htmlFor="channelName">チャンネル名</label>
                <input
                  type="text"
                  id="channelName"
                  name="channelName"
                  className="profile-input"
                  placeholder="新しいチャンネル名を入力してください"
                  autoFocus
                  disabled={ isCreatingChannelLoading }
                  value={channelName}
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>  setChannelName(e.target.value)}
                />
                <div className="help-text">
                  小文字、数字、ハイフンを使用して、チャンネルの目的がわかりやすい名前を設定してください。
                </div>
              </div>
            </div>
            { createChannelError && <div className="error-message">{ createChannelError }</div> }
          </div>

          <div className="profile-modal-footer">
            <button 
              type="button" // typeがbuttonならエンターキーで発火しない
              className="cancel-button"
              disabled={ isCreatingChannelLoading }
              onClick={() => setShowCreateChannelModal(false)}
            >キャンセル</button>
            <button 
              type="submit"
              className="save-button"
              // onClick={ () => createChannel(channelName) }
              disabled={ isCreatingChannelLoading }
            >
              { isCreatingChannelLoading ? "Loading..." : "Create" }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default CreateChannelModal;
