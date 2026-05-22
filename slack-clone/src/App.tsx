
// App.tsx

// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import CreateWorkspace from "./pages/CreateWorkspace";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import { useCurrentUserStore } from "./modules/auth/current-user.state";
import { authRepository } from "./modules/auth/auth.repository";


function App() {
  // ✅ アプリ起動時に毎回ローカルストレージのtokenを取り出して、
  //    それを使いapiに投げて、ログインユーザーのデータを取り出す。
  const [ isLoading, setIsLoading ] = useState(true);
  const { setCurrentUser } = useCurrentUserStore();

  // ログインしているユーザーデータを取得
  const fetchCurrentUser = async () => {
    try {
      const user = await authRepository.getCurrentUser();
      setCurrentUser(user);

    } catch(e) {
      console.error("ログインユーザーのデータ取得に失敗しました。", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if(isLoading) return <div>Loading...</div>

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/signup" element={ <Signup /> } />
          <Route path="/signin" element={ <Signin /> } />
          <Route path="/" element={ <CreateWorkspace /> } />

          {/* 
            Home → どのワークスペースを開いていて、どのチャンネルを開いているかの
                    情報が必要
            path="/:workspaceId/:channelId" → ページで取得できる
            http://localhost:5173/1/15 
            → この場合は、workspaceIdが1、channelIdが15で取れてくる
          */}
          <Route path="/:workspaceId/:channelId" element={ <Home /> } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
