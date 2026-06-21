import { Link } from "expo-router";
import { Image } from "expo-image";
import { Pressable, ScrollView, View } from "react-native";
import { images } from "@/assets/images";
import { AppText } from "@/lib/components/app-text";
import { useCollectionPreviews } from "@/features/feed/use-collection-previews";

export function CollectionStrip() {
  const collectionPreviews = useCollectionPreviews();

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <AppText variant="headline">My collections</AppText>
        <AppText tone="muted" variant="caption">
          Tap a mood to explore
        </AppText>
      </View>

      <ScrollView
        contentContainerStyle={{ gap: 16, paddingRight: 24 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {collectionPreviews.map(({ collection, preview }) => (
          <Link
            key={collection}
            asChild
            href={{
              pathname: "/search/[query]",
              params: { query: collection },
            }}
          >
            <Pressable
              accessibilityHint={`Browse ${collection} photos`}
              accessibilityRole="button"
              className="w-28 gap-2"
            >
              <Image
                className="h-28 w-28 rounded-[24px] bg-surface"
                contentFit="cover"
                source={
                  preview
                    ? { uri: preview.thumbUrl || preview.imageUrl }
                    : images.collectionPlaceholder
                }
                transition={180}
              />
              <AppText className="capitalize" variant="subheading">
                {collection}
              </AppText>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}
