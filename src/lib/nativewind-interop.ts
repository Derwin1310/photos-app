import { FlashList } from "@shopify/flash-list";
import { CameraView } from "expo-camera";
import { Image } from "expo-image";
import { cssInterop, remapProps } from "nativewind";

remapProps(FlashList, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
});

cssInterop(Image, {
  className: "style",
});

cssInterop(CameraView, {
  className: "style",
});
