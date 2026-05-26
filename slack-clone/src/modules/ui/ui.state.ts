
// /modules/ui/ui.state.ts

import { atom, useAtom } from "jotai";

// ワークスペースを作るときに表示するモーダルを表示するどうかのフラグ
const showCreateWorkspaceModalAtom = atom<boolean>(false);

// チェンネルを追加する時に使うフラグ
const showCreateChannelModalAtom = atom<boolean>(false);

export const useUiStore = () => {
  const [ showCreateWorkspaceModal, setShowCreateWorkspaceModal ] = useAtom(showCreateWorkspaceModalAtom)

  const [ showCreateChannelModal, setShowCreateChannelModal ] = useAtom(showCreateChannelModalAtom);

  return { 
    showCreateWorkspaceModal, 
    setShowCreateWorkspaceModal,
    
    showCreateChannelModal,
    setShowCreateChannelModal,
  };
}




