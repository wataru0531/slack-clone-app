// /pages/Home/index.ts

import WorkspaceSelector from "./WorkspaceSelector";
import "./Home.css";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { useCurrentUserStore } from "../../modules/auth/current-user.state";
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Workspace } from "../../modules/workspaces/workspace.entity";
import { workspaceRepository } from "../../modules/workspaces/workspace.repository";

function Home() {
  const { currentUser } = useCurrentUserStore();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const { workspaceId } = useParams(); // 👉 クエリパラメータを取得
  // console.log(params);
  // { workspaceId: '3c0c3995-e7de-40ac-bb91-ede59585fb14', channelId: '35356919-7e28-47ec-bd2f-2d4e3dd86cb3'}
  // → http://localhost:5173/3c0c3995-e7de-40ac-bb91-ede59585fb14/35356919-7e28-47ec-bd2f-2d4e3dd86cb3

  // ✅　現在表示しているワークスペースのデータを取得
  const selectedWorkspace = workspaces.find((workspace) => {
    return workspace.id === workspaceId;
  });
  // console.log(selectedWorkspace); // Workspace {id: '3c0c3995-e7de-40ac-bb91-ede59585fb14', ... }

  // ✅ ログインしているユーザーのワークスペースを取得
  const fetchWorkspaces = async () => {
    try {
      const workspaces = await workspaceRepository.find();
      // console.log(workspaces); // (17) [Workspace, Workspace, ...]
      setWorkspaces(workspaces);
    } catch (error) {
      console.error("ワークスペースの取得に失敗しました。", error);
    }
  };

  // ✅ 保持しているワークスペースを更新する → リアルタイムに新しいプロジェクトを追加表示する。セクション5の27
  const addWorkspaces = (_newWorkspace: Workspace) => {
    setWorkspaces((prev) => [...prev, _newWorkspace]);
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  if (currentUser == null) return <Navigate to="/signin" />;

  return (
    <div className="slack-container">
      {/* 左サイドバー。ワークスペースを選択 */}
      <WorkspaceSelector
        workspaces={workspaces}
        workspaceId={workspaceId}
        addWorkspaces={addWorkspaces}
      />

      {selectedWorkspace != null ? (
        <>
          <Sidebar selectedWorkspace={selectedWorkspace} />
          <MainContent />
        </>
      ) : (
        <div className="sidebar"></div>
      )}
    </div>
  );
}

export default Home;
