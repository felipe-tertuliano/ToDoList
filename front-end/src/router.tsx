import React, { useCallback, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboad";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import { useAuth } from "./hooks/auth"

const Router: React.FC = () => {

  const { user } = useAuth();
  const isAuthenticated = useMemo(() => user != null, [user]);

  const privateRender = useCallback((Component: React.ComponentType) => {
    return isAuthenticated ? <Component /> : <Navigate to="/sign-up" />
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<>{privateRender(Dashboard)}</>} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;