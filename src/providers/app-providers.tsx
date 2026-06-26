import type React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Auth0Provider } from "react-native-auth0";
import { AuthProvider } from "@/features/auth/auth-provider";
import { getAuth0Config } from "@/features/auth/auth-config";
import { AppearanceProvider } from "@/features/settings/appearance-provider";
import { queryClient } from "@/lib/query-client";
import { GalleryProvider } from "@/features/gallery/gallery-provider";
import { styles } from "./app-providers.styles";

type AppProvidersProps = React.PropsWithChildren;

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const authConfig = getAuth0Config();

  return (
    <GestureHandlerRootView style={styles.root}>
      <Auth0Provider domain={authConfig.domain} clientId={authConfig.clientId}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <AppearanceProvider>
              <GalleryProvider>{children}</GalleryProvider>
            </AppearanceProvider>
          </QueryClientProvider>
        </AuthProvider>
      </Auth0Provider>
    </GestureHandlerRootView>
  );
};
