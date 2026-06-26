const auth0Domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;

module.exports = ({ config }) => {
  const auth0Scheme = process.env.EXPO_PUBLIC_AUTH0_SCHEME ?? config.scheme ?? "picxplorer";

  if (!auth0Domain) {
    throw new Error("Missing EXPO_PUBLIC_AUTH0_DOMAIN. Add it to your local .env file.");
  }

  return {
    ...config,
    plugins: [
      ...(config.plugins ?? []),
      [
        "react-native-auth0",
        {
          customScheme: auth0Scheme,
          domain: auth0Domain,
        },
      ],
    ],
  };
};
