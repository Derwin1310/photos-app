import { View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { withUnistyles } from "react-native-unistyles";
import { images } from "@/assets/images";
import { AppText } from "@/lib/components/app-text";
import { IconButton } from "@/lib/components/icon-button";
import { Camera } from "lucide-react-native";
import { styles } from "./welcome-screen.styles";

const StyledImage = withUnistyles(Image);

export default function WelcomeScreen() {
  return (
    <View style={styles.root}>
      <StyledImage contentFit="cover" source={images.homeBackground} style={styles.background} />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={styles.icon}>
              <StyledImage contentFit="cover" source={images.logo} style={styles.iconImage} />
            </View>
            <AppText tone="inverse" variant="headline">
              PicXplorer
            </AppText>
          </View>

          <View style={styles.copy}>
            <AppText style={styles.title} tone="inverse" variant="title">
              Discover local photographers and keep your own visual journal.
            </AppText>
            <AppText tone="inverse">
              Browse the feed, jump into themed searches, capture a photo, and
              save it to your gallery without losing the warm personality of the
              original app.
            </AppText>
          </View>

          <IconButton
            icon={Camera}
            label="Start exploring"
            onPress={() => router.push("/feed")}
            showLabel
            style={styles.primaryButton}
          />
        </View>
      </View>
    </View>
  );
}
