

// /pages/Home/WorkspaceSelector/ProfileModal.tsx

// プロフィール変更時に使うモーダル

import { FormEvent, useRef, useState } from "react";
import { useCurrentUserStore } from "../../../modules/auth/current-user.state";
import { useUiStore } from "../../../modules/ui/ui.state";
import { accountRepository } from "../../../modules/account/account.repository";

function ProfileModal() {
  const { showProfileModal, setShowProfileModal } = useUiStore();
  const { currentUser, setCurrentUser } = useCurrentUserStore();

  const [ name, setName ] = useState(currentUser.name);
  const [ error, setError ] = useState("");
  const [ isLoading, setIsLoading ] = useState(false); 

  const fileInputRef = useRef<HTMLInputElement>(null);
  // console.log(fileInputRef); // { current: input }

  const [ thumbnail, setThumbnail ] = useState<File | undefined>(); // 画像ファイル
  const [ thumbnailUrl, setThumbnailUrl ] = useState(currentUser!.thumbnailUrl); // 画像url

  // ✅ 画像ファイルをステートに設定
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files == null || e.target.files[0] == null) return;

    const file = e.target.files[0]; // 選択したファイルを取得 → このままではブラウザでは表示不可能
    const reader = new FileReader(); // FileReader生成。組み込みのクラス
                                    //  → ブラウザに画像として表示できるurlに変換する必要があるのでFileReaderを使う

    // FileReaderに、onloadを登録 
    // → readAsDataURLでファイルを読み込みが完了してから発火
    reader.onload = () => { 
      setThumbnail(file);
      setThumbnailUrl(reader.result as string);
      // → reader.resultは、string | ArrayBuffer を期待しているのでエラーとなる。
      //   今回は文字列として扱う。型アサーション
    }

    // ✅ FileReaderがファイルを読み込む。→ 完了後にonloadが発火
    // → imgタグに設定可能な文字列になる
    // <img src="data:image/jpeg;base64,/9j/4AA..." />
    reader.readAsDataURL(file); 
  }

  // ✅ 送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if(!trimmedName) {
      setError("名前を入力してください。");
      return;
    }

    if(isLoading) return;

    try {
      setError("");
      setIsLoading(true);

      const updatedUser = await accountRepository.updateProfile(trimmedName, thumbnail);
      setCurrentUser(updatedUser); // グローバルステート更新

      setShowProfileModal(false);
    } catch(error) {
      console.error("プロフィールの更新に失敗しました。", error);
      setError("プロフィールの更新に失敗しました。")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="profile-modal-overlay"
      onClick={() => setShowProfileModal(false)}
    >
      {/* stopPropagation → 親へのイベントの電波を止める */}
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}> 
        <form onSubmit={ handleSubmit }>
          <div className="profile-modal-header">
            <h2>Edit your profile</h2>
          </div>

          <div className="profile-modal-content">
            <div className="profile-form">
              <div className="profile-form-left">
                <div className="form-group">
                  <label htmlFor="fullName">Full name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="profile-input"
                    disabled={ isLoading }
                    value={ name }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  />
                </div>
                { error && <p className="error-message">{ error }</p> }
              </div>
              <div className="profile-form-right">
                <div className="profile-photo-section">
                  <label>Profile photo</label>
                  <div className="profile-photo-container">
                    <div className="profile-photo-placeholder">
                      {
                        thumbnailUrl != null ? (
                          <img 
                            src={ thumbnailUrl } 
                            alt="プロフィール画像"
                            className="profile-photo-preview"
                          />
                        ) : (
                          <div className="profile-photo-circle" />
                        )
                      }
                    </div>
                  </div>
                  {/* ファイル送信 */}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={ fileInputRef }
                    onChange={ handleFileChange }
                  />
                  <button 
                    type="button" // デフォルトでsubmitになるので、buttonに変更。
                                  // submitとすると、クリックしたらフォームが発火してしまう。
                    className="upload-photo-button"
                    onClick={() => fileInputRef.current?.click()} // 👉 ファイルのinputをクリック
                    >Upload Photo</button>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-modal-footer">
            <button 
              type="button" // エンターキーでは発火されない
              className="cancel-button"
              disabled={ isLoading }
              onClick={() => setShowProfileModal(false)}
            >Cancel</button>
            <button
              type="submit" // エンターキーで発火
              className="save-button"
              disabled={ isLoading }
              // onClick={ updateProfile }
            >
              { isLoading ? "Saving..." : "Save Changes" }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ProfileModal;
