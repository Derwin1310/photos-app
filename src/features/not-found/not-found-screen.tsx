import { Link } from "expo-router";
import { Pressable, View } from "react-native";
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
        <Link asChild href="/">
          <Pressable style={styles.button}>
            <AppText tone="inverse" variant="subheading">
              Back home
            </AppText>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
