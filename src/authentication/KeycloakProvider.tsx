
// KeycloakProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import keycloak from "./KeycloakService";

interface KeycloakContextType {
  keycloak: typeof keycloak;
  authenticated: boolean;
  initialized: boolean;
}

const KeycloakContext = createContext<KeycloakContextType | undefined>(undefined);

export const useKeycloak = () => {
  const context = useContext(KeycloakContext);
  if (!context) throw new Error("useKeycloak must be used within KeycloakProvider");
  return context;
};

export const KeycloakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    keycloak
      .init({
        onLoad: "login-required", // this forces login
        checkLoginIframe: false, // turn off to avoid issues in dev
      })
      .then((auth:boolean) => {
        setAuthenticated(auth);
        setInitialized(true);
      })
      .catch((err:boolean) => {
        console.error("Keycloak init failed", err);
        setAuthenticated(false);
        setInitialized(true);
      });
  }, []);

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, initialized }}>
      {children}
    </KeycloakContext.Provider>
  );
};
