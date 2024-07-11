import React from "react";
import { AlertProvider } from "./hooks/alert";
import { AuthProvider } from "./hooks/auth";


interface IProps {
    children?: React.ReactNode
};

const Provider: React.FC<IProps> = ({ children }) => {
  return (
    <AlertProvider>
        <AuthProvider>
            {children}
        </AuthProvider>
    </AlertProvider>
  );
}

export default Provider;