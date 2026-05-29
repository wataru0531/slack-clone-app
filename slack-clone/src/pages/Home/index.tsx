

// /pages/Home/index.ts

// ホーム。
// 

import WorkspaceSelector from "./WorkspaceSelector";
import "./Home.css";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { useCurrentUserStore } from "../../modules/auth/current-user.state";
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Workspace } from "../../modules/workspaces/workspace.entity";
import { workspaceRepository } from "../../modules/workspaces/workspace.repository";
import type { Channel } from "../../modules/channels/channel.entity";
import { channelRepository } from "../../modules/channels/channel.repository";


function Home() {
  const { currentUser } = useCurrentUserStore();
  const [ workspaces, setWorkspaces ] = useState<Workspace[]>([]);
  const { workspaceId, channelId } = useParams(); // 👉 クエリパラメータを取得
  // console.log(params);
  // { workspaceId: '3c0c3995-e7de-40ac-bb91-ede59585fb14', channelId: '35356919-7e28-47ec-bd2f-2d4e3dd86cb3'}
  // → http://localhost:5173/3c0c3995-e7de-40ac-bb91-ede59585fb14/35356919-7e28-47ec-bd2f-2d4e3dd86cb3
  const [ channels, setChannels ] = useState<Channel[]>([])

  // ✅　現在表示しているワークスペースを取得
  const selectedWorkspace = workspaces.find((workspace) => {
    return workspace.id === workspaceId;
  });
  // console.log(selectedWorkspace); // Workspace {id: '3c0c3995-e7de-40ac-bb91-ede59585fb14', ... }

  // ✅ 今選択してるチャンネルを取得
  const selectedChannel = channels.find(channel => {
    return channel.id === channelId;
  });
  // console.log(selectedChannel)

  // ✅ ログインしているユーザーの全てのワークスペースを取得
  const fetchWorkspaces = async () => {
    try {
      const workspaces = await workspaceRepository.find();
      // console.log(workspaces); // (17) [Workspace, Workspace, ...]
      setWorkspaces(workspaces);
    } catch (error) {
      console.error("ワークスペースの取得に失敗しました。", error);
    }
  };

  // ✅ 現在表示中のワークスペースのすべてのチャンネルを取得
  const fetchChannels = async () => {
    // console.log("fetchChannels!!")
    if(workspaceId == null) return; // null、undefinedのどちらも対応可能。workspaceIdがundefinedの可能性もある

    try {
      const channels = await channelRepository.find(workspaceId);
      setChannels(channels);

    } catch(error) {
      console.error("チャンネルの取得に失敗しました。", error);
    }
  }

  // ✅ 保持しているワークスペースを更新する → リアルタイムに新しいプロジェクトを追加表示する。セクション5の27
  const addWorkspaces = (_newWorkspace: Workspace) => {
    setWorkspaces((prevState) => [...prevState, _newWorkspace]);
  };

  // ✅ 保持してるチャンネルを更新
  const addChannels = (_newChannel: Channel) => {
    setChannels((prevState) => [...prevState, _newChannel]);
  }

  // ✅ 保持しているチャンネルを1つ削除
  // → 指定したチャンネル以外を配列に入れて更新
  const deleteChannel = (channelId: string) => { 
    const updatedChannels = channels.filter(channel => (
      channel.id !== channelId
    ));

    setChannels(updatedChannels);

    return updatedChannels; // ⭐️ 配列の中がなくなる時はないようにDBで設定
                           // →  必ず1つはデータがあるように設定
  }

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    fetchChannels()
  }, [ workspaceId ]); // workspaceIdが切り替わるごとに、チャンネルを変える

  if (currentUser == null) return <Navigate to="/signin" />;

  return (
    <div className="slack-container">
      {/* 左サイドバー。ワークスペースを選択 */}
      <WorkspaceSelector
        workspaces={workspaces}
        workspaceId={workspaceId}
        addWorkspaces={addWorkspaces}
      />

      {selectedWorkspace != null && selectedChannel != null ? (
        <>
          <Sidebar 
            selectedWorkspace={ selectedWorkspace }
            channels={ channels } // ワークスペースに属しているチャネル
            channelId={ channelId } // いま開いているチャンネル
            addChannels={ addChannels } // 保持しているチャンネルを更新
          />
          <MainContent
            selectedChannel={ selectedChannel }
            channels={ channels }
            channelId={ channelId }
            workspaceId={ workspaceId }
            deleteChannel={ deleteChannel }
          />
        </>
      ) : (
        <div className="sidebar"></div>
      )}
    </div>
  );
}

export default Home;
