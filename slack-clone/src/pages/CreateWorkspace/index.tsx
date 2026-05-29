// /pages/CreateWorkspace/index.ts

import "../Signup/auth.css";
import CreateWorkspaceModal from "../Home/WorkspaceSelector/CreateWorkspaceModal";
import { useCurrentUserStore } from "../../modules/auth/current-user.state";
import { Navigate, useNavigate } from "react-router-dom";
import { workspaceRepository } from "../../modules/workspaces/workspace.repository";
import { useEffect, useState } from "react";
import { Workspace } from "../../modules/workspaces/workspace.entity";

// ① CreateWorkspaceの責務 → アプリケーションロジックを管理
// ログイン状態チェック
// API呼び出し（workspaceRepository）
// loading状態管理
// error状態管理
// ルーティング（navigate）
// ビジネスロジック（作成フロー）

// ② CreateWorkspaceModalの責務 → プレゼンテーション + 軽いUI state管理

function CreateWorkspace() {
  const { currentUser } = useCurrentUserStore();
  const navigate = useNavigate();
  const [ isCreatingWorkspaceLoading, setIsCreatingWorkspaceLoading ] =
    useState(false); // ローディング
  const [ createWorkspaceError, setCreateWorkspaceError ] = useState("");

  const [ isFetchingWorkspaceLoading, setIsFetchingWorkspaceLoading ] =
    useState(true); // ローディング
  const [ fetchWorkspacesError, setFetchWorkspacesError ] = useState("");

  // ログインユーザーが所属しているワークスペース
  const [ homeWorkspace, setHomeWorkspace ] = useState<Workspace>();

  // ログインしているユーザーの所属するワークスペースを返し、最初のワークスペースにリダイレクトさせる
  const fetchWorkspaces = async () => {
    try {
      setIsFetchingWorkspaceLoading(true);
      setFetchWorkspacesError("");

      const workspaces = await workspaceRepository.find();
      setHomeWorkspace(workspaces[0]);
    } catch (e) {
      console.error(
        "ログインユーザーのワークスペースの取得に失敗しました。",
        e,
      );
      setFetchWorkspacesError(
        "ログインユーザーのワークスペースの取得に失敗しました。",
      );
    } finally {
      setIsFetchingWorkspaceLoading(false);
    }
  };

  // ワークスペースを作成
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

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // 認証 → ロード → エラー → 成功 の順にならべていく
  if (currentUser === null) return <Navigate to="/signin" />;

  if (isFetchingWorkspaceLoading) return <div>Loading...</div>;
  if (fetchWorkspacesError) return <div>{fetchWorkspacesError}</div>;

  // ✅ 所属するワークスペースがあれば、最初に登録しているワークスペースに遷移
  if (homeWorkspace != null)
    return (
      <Navigate to={`/${homeWorkspace.id}/${homeWorkspace.channels[0].id}`} />
    );

  return (
    <div>
      <CreateWorkspaceModal
        createWorkspace={createWorkspace}
        // allowCancelは？
        isCreatingWorkspaceLoading={isCreatingWorkspaceLoading}
        createWorkspaceError={createWorkspaceError}
      />
    </div>
  );
}

export default CreateWorkspace;
