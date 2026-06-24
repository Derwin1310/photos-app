import { router } from "expo-router";
import { View } from "react-native";
import { AppButton } from "@/lib/components/app-button";
import { AppText } from "@/lib/components/app-text";
import { styles } from "./not-found-screen.styles";

export default function NotFoundScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <AppText variant="headline">That page wandered off</AppText>
        <AppText tone="muted">
          The route you requested is not available. You can head back to the home
          screen and keep exploring from there.
        </AppText>
        <AppButton label="Back home" onPress={() => router.replace("/")} />
      </View>
    </View>
  );
}
