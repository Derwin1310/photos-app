export const AUTH0_SCOPE = "openid profile email offline_access";
export const AUTH0_GOOGLE_CONNECTION = "google-oauth2";

export type Auth0Config = {
  audience?: string;
  clientId: string;
  domain: string;
  scheme: string;
};

const getRequiredEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing ${key}. Add it to your local .env file.`);
  }

  return value;
};

export const getAuth0Config = (): Auth0Config => ({
  audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE || undefined,
  clientId: getRequiredEnv("EXPO_PUBLIC_AUTH0_CLIENT_ID"),
  domain: getRequiredEnv("EXPO_PUBLIC_AUTH0_DOMAIN"),
  scheme: process.env.EXPO_PUBLIC_AUTH0_SCHEME || "picxplorer",
});
