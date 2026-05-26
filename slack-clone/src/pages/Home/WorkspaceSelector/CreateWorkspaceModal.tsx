
// /pages/Home/WorkspaceSelector/CreateWorkspaceModal';

// 新しいワークスペースを作成するモーダル

import { useState } from "react";
import { useUiStore } from "../../../modules/ui/ui.state";

type CreateWorkspaceModalProps = {
  createWorkspace: (name: string) => Promise<boolean>;
  allowCancel?: boolean; // キャンセルボタンを表示するかどうか
  isCreatingWorkspaceLoading?: boolean;
  createWorkspaceError?: string;
}


function CreateWorkspaceModal({ 
  createWorkspace, 
  allowCancel,
  isCreatingWorkspaceLoading,
  createWorkspaceError,
}: CreateWorkspaceModalProps) {
  const [ workspaceName, setWorkspaceName ] = useState(""); 

  const { showCreateWorkspaceModal, setShowCreateWorkspaceModal} = useUiStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await createWorkspace(workspaceName); // ワークスペースを作成
    if(result) setWorkspaceName("");
  }

  return (
    <div 
      className="profile-modal-overlay"
      onClick={() => setShowCreateWorkspaceModal(false)}
    >

      {/* stopPropagation() → 親要素へのイベント伝播を防ぐ */}
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <form 
          onSubmit={ handleSubmit }
          className="profile-modal-form"
        >
          <div className="profile-modal-header">
            <h2>新しいワークスペースを作成</h2>
          </div>

          <div className="profile-modal-content">
            <div className="profile-form">
              <div className="form-group">
                <label htmlFor="workspaceName">ワークスペース名</label>
                <input
                  type="text"
                  id="workspaceName"
                  name="workspaceName"
                  className="profile-input"
                  placeholder="新しいワークスペース名を入力してください"
                  autoFocus
                  disabled={ isCreatingWorkspaceLoading } // ローディング中は入力不可
                  value={ workspaceName }
                  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setWorkspaceName(e.target.value)}
                />
                <div className="help-text">
                  チームやプロジェクトの名前など、ワークスペースの用途がわかりやすい名前を設定してください。
                </div>
                <div className="error-message">
                  { createWorkspaceError && <div>{ createWorkspaceError }</div> }
                </div>
              </div>
            </div>
          </div>

          <div className="profile-modal-footer">
            {
              allowCancel && (
                <button
                  type="button" // buttonの場合 → エンターキーでは発火不可能
                  className="cancel-button"
                  disabled={ isCreatingWorkspaceLoading }
                  onClick={() => setShowCreateWorkspaceModal(false)}
                >Cancel</button>
              )
            }
            
            <button
              type="submit" // submit → エンターキーで発火可能
              className="save-button"
              disabled={ isCreatingWorkspaceLoading }
              // onClick={ () => createWorkspace(workspaceName) }
            >
              { isCreatingWorkspaceLoading ? "isLoading..." : "Create" }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default CreateWorkspaceModal;
