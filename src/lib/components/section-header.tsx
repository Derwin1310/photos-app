import type React from "react";
import { View } from "react-native";
import { AppText } from "@/lib/components/app-text";
import { styles } from "./section-header.styles";

type SectionHeaderProps = {
  subtitle?: string;
  title: string;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({ subtitle, title }) => (
  <View style={styles.root}>
    <AppText variant="headline">{title}</AppText>
    {subtitle ? <AppText style={styles.subtitle} variant="bodySmall">{subtitle}</AppText> : null}
  </View>
);
