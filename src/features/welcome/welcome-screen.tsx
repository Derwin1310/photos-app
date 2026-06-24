import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useUnistyles, withUnistyles } from "react-native-unistyles";
import { images } from "@/assets/images";
import { AppText } from "@/lib/components/app-text";
import { Camera } from "lucide-react-native";
import { styles } from "./welcome-screen.styles";
import { AppIcon } from "@/lib/components/app-icon";

const StyledImage = withUnistyles(Image);

export default function WelcomeScreen() {
  const { theme } = useUnistyles()

  return (
    <View style={styles.root}>
      <StyledImage contentFit="cover" source={images.homeBackground} style={styles.background} />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.brandRow}>
            <View style={styles.icon}>
              <StyledImage contentFit="cover" source={images.logo} style={styles.iconImage} />
            </View>
            <AppText tone="inverse" variant="display">
              PicXplorer
            </AppText>
          </View>

          <View style={styles.copy}>
            <AppText style={styles.title} tone="inverse" variant="headline">
              A personal gallery for the places and people you notice.
            </AppText>
            <AppText tone="inverse" variant="bodySmall">
              Browse editorial collections, capture a new frame, and keep the
              moments that matter close.
            </AppText>
          </View>


          <Pressable
            style={styles.startExploringButton}
            accessibilityLabel="Start exploring"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.push("/feed")}
          >
            <AppIcon icon={Camera} size={20} color="#3D2D24"/>
            <AppText style={styles.textButton}>Start exploring</AppText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
