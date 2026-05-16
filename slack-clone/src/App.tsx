
// App.tsx

// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import CreateWorkspace from "./pages/CreateWorkspace";
import Home from "./pages/Home";


function App() {

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
