
// /pages/Sidebar/UserSearchModal.tsx

import { useEffect, useState } from "react";
import { useUiStore } from "../../../modules/ui/ui.state";
import { User } from "../../../modules/users/user.entity";
import { userRepository } from "../../../modules/users/user.repository";
import { useDebouncedCallback } from "use-debounce";

// ユーザーを招待するときに使うモーダル


function UserSearchModal() {
  const { showUserSearchModal, setShowUserSearchModal } = useUiStore();
  const [ keyword, setKeyword ] = useState("");
  const [ searchResults, setSearchResults ] = useState<User[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);

  // ✅ 検索処理
  const searchUsers = async () => {
    if(keyword == "") {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);

    try {
      const users = await userRepository.find(keyword);
      // console.log(users);
      // (2) [{id: '04b85ef1-c8c7-4897-90f1-89ac530e4700', name: 'yasukawa wataru', email: 'obito0531@gmail.com', thumbnailUrl: null, workspaceUsers: Array(19)}, User]

      setSearchResults(users);

    } catch(error) {
      console.error("ユーザー検索中にエラーが発生しました。", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ デバウンスの設定 → 検索の文字入力が500ms止まったら発火する
  const debouncedSearch = useDebouncedCallback(searchUsers, 500);

  useEffect(() => {
    debouncedSearch();
  }, [ keyword ])

  return (
    <div 
      className="modal-overlay"
      onClick={() => setShowUserSearchModal(false)}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>メンバーを招待する</h2>
          <button 
            className="close-button"
            onClick={() => setShowUserSearchModal(false)}
          >×</button>
        </div>

        <div className="modal-content">
          <div className="invite-form">
            <label htmlFor="invite-input">招待するメンバー：</label>
            <div className="selected-users-container">
              <div key={1} className="selected-user-chip">
                <img
                  src={
                    'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'
                  }
                  alt={'test'}
                  className="user-avatar small"
                />
                <span>{'test'}</span>
                <button 
                  className="remove-user-button"
                  onClick={() => setShowUserSearchModal(false)}
                >×</button>
              </div>
              <input 
                type="text" 
                id="invite-input" 
                className="invite-input" 
                value={ keyword }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          <div className="user-suggestions">
            {
              isLoading ? (
                <div className="loading-indicator">Loading...</div>
              ) : (
                searchResults && searchResults.map((user) => {
                  // console.log(user);
                  // User {id: '04b85ef1-c8c7-4897-90f1-89ac530e4700', name: 'yasukawa wataru', email: 'obito0531@gmail.com', thumbnailUrl: null, workspaceUsers: Array(19)}

                  return (
                    <div key={ user.id } className={`user-suggestion-item`}>
                      <img
                        src={ user.iconUrl }
                        alt={ user.name }
                        className="user-avatar"
                      />
                      <div className="user-info">
                        <div className="user-name">{ user.name }</div>
                        <div className="user-email">{ user.email }</div>
                      </div>
                    </div>
                  )
                })
              )
              
            }
          </div>

          <div className="modal-footer">
            <button className="invite-button">招待する</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSearchModal;
