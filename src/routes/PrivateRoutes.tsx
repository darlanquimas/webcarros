import { ReactNode, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface PrivateProps {
  children: ReactNode;
}

export function PrivateRoutes({ children }: PrivateProps) {
  const { signed, loadingAuth } = useContext(AuthContext);

  if (loadingAuth) {
    // You might want to render a loading spinner here
    return <div>Loading...</div>;
  }

  if (!signed) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
