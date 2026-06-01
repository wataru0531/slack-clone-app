

// /pages/Home/WorkspaceSelector/ProfileModal.tsx

import { useState } from "react";
import { useCurrentUserStore } from "../../../modules/auth/current-user.state";
import { useUiStore } from "../../../modules/ui/ui.state";
import { accountRepository } from "../../../modules/account/account.repository";

// プロフィール変更時に使うモーダル

// ✅ TODO フォームに変更

function ProfileModal() {
  const { showProfileModal, setShowProfileModal } = useUiStore();
  const { currentUser, setCurrentUser } = useCurrentUserStore();

  const [ name, setName ] = useState(currentUser.name);

  // ✅ 変更する処理
  const updateProfile = async () => {
    try {
      const user = await accountRepository.updateProfile(name);

      setCurrentUser(user); // グローバルステート更新
      setShowProfileModal(false); // モーダル閉じる

    } catch(error) {
      console.error("プロフィールの更新に失敗しました。", error);
    }
  }

  return (
    <div 
      className="profile-modal-overlay"
      onClick={() => setShowProfileModal(false)}
    >
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
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
                  value={ name }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="profile-form-right">
              <div className="profile-photo-section">
                <label>Profile photo</label>
                <div className="profile-photo-container">
                  <div className="profile-photo-placeholder">
                    <div className="profile-photo-circle" />
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button className="upload-photo-button">Upload Photo</button>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-modal-footer">
          <button 
            className="cancel-button"
            onClick={() => setShowProfileModal(false)}
          >Cancel</button>
          <button 
            className="save-button"
            onClick={ updateProfile }
          >Save Changes</button>
        </div>
      </div>
    </div>
  );
}
export default ProfileModal;
