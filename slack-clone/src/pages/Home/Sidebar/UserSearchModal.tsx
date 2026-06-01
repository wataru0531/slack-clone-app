
// /pages/Sidebar/UserSearchModal.tsx

// ユーザーを招待するときに使うモーダル

import { useEffect, useState } from "react";
import { useUiStore } from "../../../modules/ui/ui.state";
import { User } from "../../../modules/users/user.entity";
import { userRepository } from "../../../modules/users/user.repository";
import { useDebouncedCallback } from "use-debounce";
import { Workspace } from "../../../modules/workspaces/workspace.entity";
import { workspaceUserRepository } from "../../../modules/workspaceUsers/workspace-user.repository";

type UserSearchModalPropsType = {
  selectedWorkspace: Workspace;
}

function UserSearchModal({ selectedWorkspace }: UserSearchModalPropsType) {
  const { showUserSearchModal, setShowUserSearchModal } = useUiStore();
  const [ keyword, setKeyword ] = useState("");
  const [ searchResults, setSearchResults ] = useState<User[]>([]); // ユーザーの検索結果を格納
  const [ selectedUsers, setSelectedUsers ] = useState<User[]>([]); // ユーザーを選択
  const [ isLoading, setIsLoading ] = useState(false);

  // ✅ 選択中のユーザーに1人追加する
  const addUser = (user: User) => {
    // すでに追加済みのユーザーの中に、追加したいユーザーがいなければ追加
    // some() → 条件に一致する要素が1つでもあるか。
    if(!selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setKeyword("");
    setSearchResults([]);
  }

  // ✅ 選択中のユーザーから、ユーザーを1人削除する
  const removeUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId)) // idが一致しないユーザーを外す
  }

  // ✅ ワークスペースにユーザーを招待
  const inviteUsers = async () => {
    try {
      workspaceUserRepository.create(
        selectedWorkspace.id, 
        selectedUsers.map(user => user.id)
      );

    } catch(error) {
      console.error("ユーザーの招待に失敗しました。", error);
    } finally {
      setShowUserSearchModal(false); // モーダル閉じる
    }
    
  }

  // ✅ 検索処理
  const searchUsers = async () => {
    if(keyword == "") {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);

    try {
      // ✅ ログイン中の自分以外のユーザーを取得
      const users = await userRepository.find(keyword);
      // console.log(users);

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
              {
                // ⭐️ 選択中のユーザー
                selectedUsers && (
                  selectedUsers.map((user) => {
                    // console.log(user);

                    return (
                      <div key={ user.id } className="selected-user-chip">
                        <img
                          src={ user.thumbnailUrl && 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'}
                          alt={ user.name }
                          className="user-avatar small"
                        />
                        <span>{ user.name }</span>
                        <button
                          className="remove-user-button"
                          onClick={ () => removeUser(user.id) }
                        >×</button>
                      </div>
                    )
                  })
                )
              }
              {/* ✅ ユーザー検索バー */}
              <input
                type="text" 
                id="invite-input" 
                className="invite-input" 
                value={ keyword }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          {/*  */}
          <div className="user-suggestions">
            {
              isLoading ? (
                <div className="loading-indicator">Loading...</div>
              ) : (
                // ⭐️ ユーザーの検索結果
                searchResults && searchResults.map((user) => {
                  // console.log(user);
                  
                  // 検索結果で表示されているユーザーが参加しているワークスペースのidと
                  // いま招待しようとしているワークスペースのidが一致すればtrueを返す
                  // 👉 すでにワークスペースに招待されているということ
                  const isInWorkspace = user.workspaceUsers.some((workspaceUser) => {
                    return workspaceUser.workspaceId == selectedWorkspace.id;
                  })

                  return (
                    <div 
                      key={ user.id } 
                      className={`user-suggestion-item ${isInWorkspace ? "already-invited" : ""}`}
                      // すでにそのワークスペースに追加済みならundefinedにする
                      onClick={ isInWorkspace ? undefined : () => addUser(user) }
                    >
                      <img
                        src={ user.iconUrl }
                        alt={ user.name }
                        className="user-avatar"
                      />
                      <div className="user-info">
                        <div className="user-name">{ user.name }</div>
                        <div className="user-email">{ user.email }</div>
                        {
                          isInWorkspace && (
                            <div className="already-invited-tag">すでに紹介済みです</div>
                          )
                        }
                      </div>
                    </div>
                  )
                })
              )
            }
          </div>

          <div className="modal-footer">
            {/* ✅ ワークスペースにユーザーを招待 */}
            <button
              className="invite-button"
              onClick={ inviteUsers }
              disabled={ selectedUsers.length === 0 }
            >招待する</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSearchModal;