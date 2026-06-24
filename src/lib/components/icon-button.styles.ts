import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  button: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceTranslucent,
    borderRadius: 999,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: { marginLeft: 8 },
  pressed: { opacity: 0.8 },
}));
