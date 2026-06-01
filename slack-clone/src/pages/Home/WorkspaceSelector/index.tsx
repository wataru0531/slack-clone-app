// /pages/WorkspaceSelector/index.ts

// 3つで構成
// 左サイドバー
// ワークスペースを選択するサイドバー
// メインコンテンツ部分

import { useNavigate } from "react-router-dom";
import { useUiStore } from "../../../modules/ui/ui.state";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import ProfileModal from "./ProfileModal";
import { useState } from "react";
import { workspaceRepository } from "../../../modules/workspaces/workspace.repository";
import type { Workspace } from "../../../modules/workspaces/workspace.entity";
import { useCurrentUserStore } from "../../../modules/auth/current-user.state";

type WorkspaceSelectorPropsType = {
  workspaces: Workspace[];
  workspaceId: string; // 現在表示しているワークスペースのid
  addWorkspaces: (_newWorkspace: Workspace) => void;
};

function WorkspaceSelector({
  workspaces,
  workspaceId,
  addWorkspaces,
}: WorkspaceSelectorPropsType) {
  // console.log(workspaces); // (17) [Workspace, Workspace, ...]
  // console.log(workspaces[0]);
  // → Workspace {id: 'd4e717d2-f836-425a-8456-1b69edcdb42b', name: 'Not Equal', adminUserId: '04b85ef1-c8c7-4897-90f1-89ac530e4700', createdAt: '2026-05-22T08:54:17.000Z', updatedAt: '2026-05-22T08:54:17.000Z',
  //              channels: [{createdAt: "2026-05-22T08:54:17.000Z"id: "d2237004-a826-401e-b50c-a2b2e7698eb3"name: "general"updatedAt: "2026-05-22T08:54:17.000Z"workspaceId: "d4e717d2-f836-425a-8456-1b69edcdb42b"}]…}

  // モーダルを表示するどうかのフラグ
  const { 
    showCreateWorkspaceModal, // ワークスペースを作るときに表示するモーダルのフラグ
    setShowCreateWorkspaceModal,
    showProfileModal, // プロフィール変更時のモーダルのフラグ
    setShowProfileModal,
  } = useUiStore();
  const [isCreatingWorkspaceLoading, setIsCreatingWorkspaceLoading] = useState(false);
  const [createWorkspaceError, setCreateWorkspaceError] = useState("");

  const navigate = useNavigate();

  const { setCurrentUser } = useCurrentUserStore();

  // ✅ ワークスペースを作成する処理
  const createWorkspace = async (name: string): Promise<boolean> => {
    const trimmedName = name.trim();
    if (trimmedName === "") return;
    if (isCreatingWorkspaceLoading) return;

    try {
      setCreateWorkspaceError("");
      setIsCreatingWorkspaceLoading(true);
      const newWorkspace = await workspaceRepository.create(trimmedName);
      // console.log(newWorkspace);
      // → Workspace {id: 'd4e717d2-f836-425a-8456-1b69edcdb42b', name: 'Not Equal', adminUserId: '04b85ef1-c8c7-4897-90f1-89ac530e4700', createdAt: '2026-05-22T08:54:17.000Z', updatedAt: '2026-05-22T08:54:17.000Z',
      //              channels: [{createdAt: "2026-05-22T08:54:17.000Z"id: "d2237004-a826-401e-b50c-a2b2e7698eb3"name: "general"updatedAt: "2026-05-22T08:54:17.000Z"workspaceId: "d4e717d2-f836-425a-8456-1b69edcdb42b"}]…}

      addWorkspaces(newWorkspace);

      setShowCreateWorkspaceModal(false); // モーダルを閉じる

      // ワークスペース作成後、そのワークスペースのページに遷移
      // <Route path="/:workspaceId/:channelId" element={ <Home /> } />
      // 遷移先例 : http://localhost:5173/ade88324-a6a3-47d2-99c5-baebb338d19c/fab52aed-865c-47ee-8c66-c5a6f83b9ad8
      navigate(`/${newWorkspace.id}/${newWorkspace.channels[0].id}`);

      return true;
    } catch (e) {
      console.error("ワークスペースの作成に失敗しました。", e);
      setCreateWorkspaceError("ワークスペースの作成に失敗しました。");
      return false;
    } finally {
      setIsCreatingWorkspaceLoading(false);
    }
  };

  // ✅ ログアウト
  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(undefined);
  }

  return (
    <div className="workspace-selector">
      {/* 左サイドバー。ワークスペース選択、クリック時に遷移 */}
      <div className="workspaces">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className={`workspace-icon ${workspace.id === workspaceId ? "active" : ""}`}
            onClick={() =>
              navigate(`/${workspace.id}/${workspace.channels[0].id}`)
            }
            // style={ workspace.id === workspaceId ? { backgroundColor: "#5865f2" } : {} }
          >
            {workspace.name.charAt(0)}
          </div>
        ))}

        <div
          className="workspace-icon add"
          onClick={() => setShowCreateWorkspaceModal(true)}
        >
          +
        </div>
      </div>

      <div className="user-profile">
        {/* アバター、ログアウト */}
        <div 
          className={`avatar-img `}
          onClick={() => setShowProfileModal(true)}
        >
          <img
            src={"https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"}
            alt="Posted image"
            className="message-image"
          />
        </div>

        {/* ログアウト */}
        <div 
          className="logout-button" 
          title="ログアウト"
          onClick={ logout }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>
      </div>

      {
        // ワークスペースを作成するモーダル
        showCreateWorkspaceModal && (
          <CreateWorkspaceModal
            createWorkspace={createWorkspace}
            allowCancel={true}
            isCreatingWorkspaceLoading={isCreatingWorkspaceLoading}
            createWorkspaceError={createWorkspaceError}
          />
        )
      }

      {/* プロフィール変更時に使うモーダル */}
      {
        showProfileModal && (
          <ProfileModal />
        )
      }
    </div>
  );
}
export default WorkspaceSelector;
