import { View } from "react-native";
import { AppText } from "@/lib/components/app-text";
import { styles } from "./section-header.styles";

type SectionHeaderProps = {
  subtitle?: string;
  title: string;
};

export function SectionHeader({ subtitle, title }: SectionHeaderProps) {
  return (
    <View style={styles.root}>
      <AppText variant="headline">{title}</AppText>
      {subtitle ? <AppText style={styles.subtitle} variant="bodySmall">{subtitle}</AppText> : null}
    </View>
  );
}
