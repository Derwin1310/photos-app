import { useWindowDimensions, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/assets/images";
import { AppText } from "@/lib/components/app-text";
import { IconButton } from "@/lib/components/icon-button";
import { Camera } from "lucide-react-native";

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 32, 460);

  return (
    <View className="flex-1 bg-black">
      <Image className="absolute inset-0" contentFit="cover" source={images.homeBackground} />
      <SafeAreaView className="flex-1 justify-end px-4 pb-4">
        <View
          className="self-center gap-5 rounded-[36px] bg-black/60 px-6 py-8"
          style={{ width: cardWidth }}
        >
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 overflow-hidden rounded-full">
              <Image className="h-full w-full" contentFit="cover" source={images.logo} />
            </View>
            <AppText tone="inverse" variant="headline">
              PhotoSearch
            </AppText>
          </View>

          <View className="gap-3">
            <AppText className="max-w-sm" tone="inverse" variant="title">
              Discover local photographers and keep your own visual journal.
            </AppText>
            <AppText tone="inverse">
              Browse the feed, jump into themed searches, capture a photo, and
              save it to your gallery without losing the warm personality of the
              original app.
            </AppText>
          </View>

          <IconButton
            className="self-start bg-white px-5 py-3"
            icon={Camera}
            label="Start exploring"
            onPress={() => router.push("/feed")}
            showLabel
            textClassName="text-ink"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
