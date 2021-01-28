import React from "react";
import { RootRoute } from "../routes/RootRoute";
import { AuthProvider } from "./AuthProvider";
import { SocketProvider } from "./SocketProvider";

interface RootProviderProps {}

export const RootProvider: React.FC<RootProviderProps> = ({}) => {
  return (
    <AuthProvider>
      <SocketProvider>
        <RootRoute />
      </SocketProvider>
    </AuthProvider>
  );
};
