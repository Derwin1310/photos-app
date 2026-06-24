import { Link } from "expo-router";
import { Image } from "expo-image";
import { Pressable, ScrollView, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";
import { images } from "@/assets/images";
import { AppText } from "@/lib/components/app-text";
import { useCollectionPreviews } from "@/features/feed/hooks/use-collection-previews";
import { styles } from "./collection-strip.styles";

const StyledImage = withUnistyles(Image);

export function CollectionStrip() {
  const collectionPreviews = useCollectionPreviews();

  return (
    <View style={styles.root}>
      <View style={styles.titleRow}>
        <AppText variant="headline">My collections</AppText>
        <AppText tone="muted" variant="caption">
          Tap a mood to explore
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.list}>
          {collectionPreviews.map(({ collection, preview }) => (
            <Link
              key={collection}
              asChild
              push
              href={{
                pathname: "/search/[query]",
                params: { query: collection },
              }}
            >
              <Pressable
                accessibilityHint={`Browse ${collection} photos`}
                accessibilityRole="button"
                style={styles.card}
              >
                <StyledImage
                  contentFit="cover"
                  recyclingKey={preview?.id ?? collection}
                  source={
                    preview
                      ? { uri: preview.thumbUrl || preview.imageUrl }
                      : images.collectionPlaceholder
                  }
                  style={styles.image}
                  transition={180}
                />
                <AppText style={styles.title} variant="subheading">
                  {collection}
                </AppText>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
