import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfilePages from "./pages/ProfilePages";

import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import ChatPage from "./pages/ChatPage";

function App() {
  const { checkAuth, authUser,checkingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if(checkingAuth){
    return null
  }

  return (
    <div
      className="absolute inset-0 -z-10 w-full h-full bg-white 
    bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]
    bg-[size:6rem_4rem]"
    >
      <Routes>
        {/* HomePage for authenticated users */}
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/auth" />} />
        {/* AuthPage for unauthenticated users */}
        <Route path="/auth" element={!authUser ? <AuthPage /> : <Navigate to="/" />} />
        {/* ProfilePages only accessible if authenticated */}
        <Route path="/profile" element={authUser ? <ProfilePages /> : <Navigate to="/auth" />} />
        {/* ChatPages protected route */}
        <Route path="/chat/:id" element={authUser ? <ChatPage /> : <Navigate to="/auth" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
