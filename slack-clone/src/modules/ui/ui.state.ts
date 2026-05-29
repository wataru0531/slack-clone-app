
// /modules/ui/ui.state.ts

// 👉 表示に関するstore。
//    モーダル、

import { atom, useAtom } from "jotai";

// ワークスペースを作るときに表示するモーダルのフラグ
const showCreateWorkspaceModalAtom = atom<boolean>(false);

// チェンネルを追加する時に使うモーダルのフラグ
const showCreateChannelModalAtom = atom<boolean>(false);

// ユーザーを招待する時に使うモーダルのフラグ
const showUserSearchModalAtom = atom<boolean>(false);

export const useUiStore = () => {
  const [ showCreateWorkspaceModal, setShowCreateWorkspaceModal ] = useAtom(showCreateWorkspaceModalAtom)

  const [ showCreateChannelModal, setShowCreateChannelModal ] = useAtom(showCreateChannelModalAtom);

  const [ showUserSearchModal, setShowUserSearchModal ] = useAtom(showUserSearchModalAtom);

  return { 
    showCreateWorkspaceModal, // ワークスペースを制作時のモーダル
    setShowCreateWorkspaceModal,
    
    showCreateChannelModal, // チャンネル作成時のモーダル
    setShowCreateChannelModal,

    showUserSearchModal, // ユーザーを招待する時に使うモーダル
    setShowUserSearchModal,


  };
}




