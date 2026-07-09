import type React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Auth0Provider } from "react-native-auth0";
import { getAuth0Config } from "@/features/auth/auth-config";
import { queryClient } from "@/lib/query-client";
import { appStore } from "@/lib/state/app-store";
import { StateBootstrap } from "@/providers/state-bootstrap";
import { styles } from "./app-providers.styles";

type AppProvidersProps = React.PropsWithChildren;

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const authConfig = getAuth0Config();

  return (
    <GestureHandlerRootView style={styles.root}>
      <Auth0Provider domain={authConfig.domain} clientId={authConfig.clientId}>
        <JotaiProvider store={appStore}>
          <QueryClientProvider client={queryClient}>
            <StateBootstrap>{children}</StateBootstrap>
          </QueryClientProvider>
        </JotaiProvider>
      </Auth0Provider>
    </GestureHandlerRootView>
  );
};
