
// /pages/CreateWorkspace/index.ts


import '../Signup/auth.css';
import CreateWorkspaceModal from '../Home/WorkspaceSelector/CreateWorkspaceModal';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { Navigate, useNavigate } from 'react-router-dom';
import { workspaceRepository } from '../../modules/workspaces/workspace.repositoty';


// ✅ TODO リファクタリング
function CreateWorkspace() {
  const { currentUser } = useCurrentUserStore();
  const navigate = useNavigate();

  if(currentUser === null) return <Navigate to="/signin" />

  // ワークスペースを作成する
  const createWorkspace = async (name: string) => {
    try {
      const newWorkspace = await workspaceRepository.create(name);
      // console.log(newWorkspace); 
      // → Workspace {id: 'd4e717d2-f836-425a-8456-1b69edcdb42b', name: 'Not Equal', adminUserId: '04b85ef1-c8c7-4897-90f1-89ac530e4700', createdAt: '2026-05-22T08:54:17.000Z', updatedAt: '2026-05-22T08:54:17.000Z', 
      //              channels: [{createdAt: "2026-05-22T08:54:17.000Z"id: "d2237004-a826-401e-b50c-a2b2e7698eb3"name: "general"updatedAt: "2026-05-22T08:54:17.000Z"workspaceId: "d4e717d2-f836-425a-8456-1b69edcdb42b"}]…}

      // ワークスペース作成後、そのワークスペースのページに遷移
      // <Route path="/:workspaceId/:channelId" element={ <Home /> } />
      // 遷移先例 : http://localhost:5173/ade88324-a6a3-47d2-99c5-baebb338d19c/fab52aed-865c-47ee-8c66-c5a6f83b9ad8
      navigate(`/${newWorkspace.id}/${newWorkspace.channels[0].id}`);



    } catch(e) {
      console.error("ワークスペースの作成に失敗しました。", e);

    }
  }


  return (
    <div>
      <CreateWorkspaceModal
        createWorkspace={ createWorkspace }

      />
    </div>
  );
}

export default CreateWorkspace;
