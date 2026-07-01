import type React from "react";
import { router } from "expo-router";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/lib/components/app-button";
import { AppText } from "@/lib/components/app-text";
import { styles } from "./not-found-screen.styles";

const NotFoundScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <AppText variant="headline">{t("states.notFoundTitle")}</AppText>
        <AppText tone="muted">
          {t("states.notFoundMessage")}
        </AppText>
        <AppButton label={t("states.notFoundBackHome")} onPress={() => router.replace("/")} />
      </View>
    </View>
  );
};

export default NotFoundScreen;
