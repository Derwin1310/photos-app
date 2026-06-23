import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import { AppText } from "@/lib/components/app-text";

export default function NotFoundScreen() {
  return (
    <View className="flex-1 justify-center px-5">
      <View className="gap-4 rounded-[32px] bg-surface px-6 py-8">
        <AppText variant="headline">That page wandered off</AppText>
        <AppText tone="muted">
          The route you requested is not available. You can head back to the home
          screen and keep exploring from there.
        </AppText>
        <Link asChild href="/">
          <Pressable className="self-start rounded-full bg-accent px-5 py-3">
            <AppText tone="inverse" variant="subheading">
              Back home
            </AppText>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
