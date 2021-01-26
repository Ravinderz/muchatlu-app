import React from "react";
import { RootRoute } from "../routes/RootRoute";
import { AuthProvider } from "./AuthProvider";

interface RootProviderProps {}

export const RootProvider: React.FC<RootProviderProps> = ({}) => {
  return (
    <AuthProvider>
      <RootRoute />
    </AuthProvider>
  );
};
