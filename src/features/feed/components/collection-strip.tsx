import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { Pressable, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";
import { images } from "@/assets/images";
import { AppText } from "@/lib/components/app-text";
import { SectionHeader } from "@/lib/components/section-header";
import { useCollectionPreviews } from "@/features/feed/hooks/use-collection-previews";
import { styles } from "./collection-strip.styles";

const StyledImage = withUnistyles(Image);
const StyledFlashList = withUnistyles(FlashList) as typeof FlashList;

export function CollectionStrip() {
  const collectionPreviews = useCollectionPreviews();

  return (
    <View style={styles.root}>
      <SectionHeader subtitle="Browse a visual mood." title="Collections" />
      <StyledFlashList
        contentContainerStyle={styles.list}
        data={collectionPreviews}
        horizontal
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={({ collection }) => collection}
        renderItem={({ item: { collection, preview } }) => (
          <Link
            asChild
            push
            href={{
              pathname: "/search/[query]",
              params: { query: collection },
            }}
          >
            <Pressable accessibilityHint={`Browse ${collection} photos`} accessibilityRole="button" style={styles.card}>
              <StyledImage
                contentFit="cover"
                recyclingKey={preview?.id ?? collection}
                source={preview ? { uri: preview.thumbUrl || preview.imageUrl } : images.collectionPlaceholder}
                style={styles.image}
                transition={180}
              />
              <AppText style={styles.title} variant="bodySmall">
                {collection}
              </AppText>
            </Pressable>
          </Link>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
