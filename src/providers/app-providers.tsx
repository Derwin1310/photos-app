import type React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppearanceProvider } from "@/features/settings/appearance-provider";
import { queryClient } from "@/lib/query-client";
import { GalleryProvider } from "@/features/gallery/gallery-provider";
import { styles } from "./app-providers.styles";

type AppProvidersProps = React.PropsWithChildren;

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <GestureHandlerRootView style={styles.root}>
    <QueryClientProvider client={queryClient}>
      <AppearanceProvider>
        <GalleryProvider>{children}</GalleryProvider>
      </AppearanceProvider>
    </QueryClientProvider>
  </GestureHandlerRootView>
);
