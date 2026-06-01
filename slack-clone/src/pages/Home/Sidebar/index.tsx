
// pages/Home/Sidebar/index.ts

// ✅ 左から2番目のサイドバー
// 現在開いているワークスペース名、チャンネル

import { useNavigate } from 'react-router-dom';
import { channelRepository } from '../../../modules/channels/channel.repository';
import { useUiStore } from '../../../modules/ui/ui.state';
import { Workspace } from '../../../modules/workspaces/workspace.entity';
import CreateChannelModal from './CreateChannelModal';
import { useState } from 'react';
import type { Channel } from '../../../modules/channels/channel.entity';
import UserSearchModal from './UserSearchModal';


type SidebarProps = {
  selectedWorkspace: Workspace;
  channels: Channel[];
  channelId: string; // 今表示しているチャンネルのid
  addChannels: (newChannel: Channel) => void;
}


function Sidebar({ 
  selectedWorkspace,
  channels,
  channelId,
  addChannels
}: SidebarProps) {
  // console.log(selectedWorkspace);
  // Workspace {id: '3c0c3995-e7de-40ac-bb91-ede59585fb14', name: 'project-05-25', channels: Array(1), adminUserId: '04b85ef1-c8c7-4897-90f1-89ac530e4700', createdAt: '2026-05-25T09:13:27.000Z', …}

  const { 
    showCreateChannelModal, // チャンネル作成時に使うモーダル
    setShowCreateChannelModal,
    showUserSearchModal, // ユーザー招待時に使うモーダル
    setShowUserSearchModal,
  } = useUiStore();
  // console.log(showCreateChannelModal);
  const navigate = useNavigate();

  const [ isCreatingChannelLoading, setIsCreatingChannelLoading ] = useState(false); // ローディング
  const [ createChannelError, setCreateChannelError ] = useState(""); // エラー文

  // ✅ チャンネルを作成する関数
  const createChannel = async (name: string) => {
    try {
      setCreateChannelError("");
      setIsCreatingChannelLoading(true);

      const trimmedName = name.trim();
      if(!trimmedName) {
        setCreateChannelError("チャンネル名を入力してください。");
        return;
      }

      const newChannel = await channelRepository.create(selectedWorkspace.id, trimmedName);
      // console.log(newChannel);
      // Channel {id: '7de4e967-0b23-454d-b08c-553073432982', name: 'newChanel', workspaceId: '19c69194-d1de-46da-8ee6-06425b51a53c', createdAt: '2026-05-26T08:52:38.000Z', updatedAt: '2026-05-26T08:52:38.000Z'}

      addChannels(newChannel); // リアルタイムにチャンネルの並びを更新
      
      setShowCreateChannelModal(false);

      navigate(`/${selectedWorkspace.id}/${newChannel.id}`);
    } catch(error) {
      console.error("チャンネルの作成に失敗しました。", error);
      setCreateChannelError("チャンネルの作成に失敗しました。");
    } finally {
      setIsCreatingChannelLoading(false);
    }
  }

  return (
    <div className="sidebar">
      <div className="workspace-header">
        <h2>{ selectedWorkspace.name }</h2>
      </div>
      <div className="sidebar-section">
        <div className="section-header channels-header">
          <svg viewBox="0 0 20 20" width="10" height="10" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <h3>Channels</h3>
        </div>
        <ul className={`channels-list expanded`}>
          {
            channels.map((channel) => {
              // console.log(channel);
              // → Channel {id: 'c448d4c4-ec88-441a-94e2-e2784f03e13a', name: 'チャンネル4', workspaceId: '286d8306-bf21-4ce0-9063-b01b4807a5e7', createdAt: '2026-05-27T08:51:29.000Z', updatedAt: '2026-05-27T08:51:29.000Z'}
              return(
                <li 
                  key={ channel.id } 
                  className={`${channel.id == channelId ? "active" : ""}`}
                  onClick={() => navigate(`/${selectedWorkspace.id}/${channel.id}`) }
                >
                  <span className="channel-icon">#</span> { channel.name }
                </li>
              )
            })
          }

          {/* 追加ボタン */}
          <li onClick={ () => setShowCreateChannelModal(true) }>
            <span className="channel-icon add">+</span> Add channels
          </li>
        </ul>

        <div 
          className="section-header channels-header"
          onClick={ () => setShowUserSearchModal(true) }
        >
          <span className="channel-icon add">+</span> Invite People
        </div>
      </div>

      {/* チェンネルを作成するモーダル */}
      {
        showCreateChannelModal && (
          <CreateChannelModal 
            createChannel={ createChannel }
            isCreatingChannelLoading={ isCreatingChannelLoading }
            createChannelError={ createChannelError }
          />
        )
      }

      {/* ユーザーを招待するときに使うモーダル */}
      {
        showUserSearchModal && (
          <UserSearchModal 
            selectedWorkspace={ selectedWorkspace }
          />
        )
      }
    </div>
  );
}
export default Sidebar;
