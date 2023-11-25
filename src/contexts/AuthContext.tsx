import { onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { auth } from "../services/firebaseConnection";

interface AuthProviderProps {
  children: ReactNode;
}

type AuthContextData = { signed: boolean; loadingAuth: boolean };

interface UserProps {
  uid: string;
  name: string | null;
  email: string | null;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoagindAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          name: user?.displayName,
          email: user?.email,
        });
        setLoagindAuth(false);
      } else {
        setUser(null);
        setLoagindAuth(false);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loadingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
