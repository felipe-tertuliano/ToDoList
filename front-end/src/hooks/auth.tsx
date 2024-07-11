import React, { useState, useCallback, createContext, useContext } from "react";
import api from "../services/api";

interface IUser {
  username: string;
}

interface ICredentials {
  username: string;
  password: string;
}

interface IAuthState {
  user?: IUser;
  token?: string;
}

interface IAuthContext {
  user?: IUser;
  signUp(credentials: ICredentials): Promise<any>;
  signIn(credentials: ICredentials): Promise<any>;
  signOut(): void;
}

interface IProps {
  children?: React.ReactNode
};

const SESSION_KEYS = {
  "user": "@ToDoList:user",
  "token": "@ToDoList:token",
};

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC<IProps> = ({ children }) => {

  const [data, setData] = useState<IAuthState>({});

  const setUpData = useCallback((authState: IAuthState) => {

    localStorage.setItem(SESSION_KEYS.token, authState.token ?? "");
    localStorage.setItem(SESSION_KEYS.user, authState.user ?
      JSON.stringify(authState.user) :
      ""
    );

    if (authState.user && authState.token) {
      api.defaults.headers.authorization = `Bearer ${authState.token}`;
      setData(authState);
    } else {
      setData({});
    }
  }, []);

  const signUp = useCallback((credentials: ICredentials) => {
    return new Promise((resume, reject) => {
      api.post(`/user`, credentials).then(response => {
        if (response.status < 300 && response.status >= 200) {
          resume(credentials);
        } else {
          reject(response?.data ?? response);
        }
      }).catch(({ response }) => { reject(response?.data ?? response); });
    });
  }, []);

  const signIn = useCallback((credentials: ICredentials) => {
    return new Promise((resume, reject) => {
      api.post(`/auth`, credentials).then(response => {

        if (response.status < 300 && response.status >= 200) {
          let user: IUser = response.data["user"];
          let token: string = response.data["token"];
          localStorage.setItem(SESSION_KEYS.token, token);
          localStorage.setItem(SESSION_KEYS.user, JSON.stringify(user));
          setUpData({ token, user });
          resume(user);
        } else {

          reject(response?.data ?? response);
        }
      }).catch(({ response }) => { reject(response?.data ?? response); });
    });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEYS.token);
    localStorage.removeItem(SESSION_KEYS.user);
    setUpData({});
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}