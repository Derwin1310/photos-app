const fs = require("node:fs");
const path = require("node:path");

const loadLocalEnv = () => {
  const envPath = path.join(__dirname, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const envFile = fs.readFileSync(envPath, "utf8");

  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);

    if (!match) {
      continue;
    }

    const [, key, rawValue = ""] = match;

    if (process.env[key]) {
      continue;
    }

    process.env[key] = rawValue
      .replace(/^['"]|['"]$/g, "")
      .trim();
  }
};

loadLocalEnv();

module.exports = ({ config }) => {
  const auth0Domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
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
