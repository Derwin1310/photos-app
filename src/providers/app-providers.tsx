import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppearanceProvider } from "@/features/settings/appearance-provider";
import { queryClient } from "@/lib/query-client";
import { GalleryProvider } from "@/features/gallery/gallery-provider";
import { styles } from "./app-providers.styles";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <AppearanceProvider>
          <GalleryProvider>{children}</GalleryProvider>
        </AppearanceProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
