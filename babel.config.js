const path = require("node:path");

module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "react-native-unistyles/plugin",
        {
          root: "app",
          // Absolute paths prevent matching dependency folders such as expo/src.
          autoProcessPaths: [path.join(__dirname, "src")],
        },
      ],
    ],
  };
};
