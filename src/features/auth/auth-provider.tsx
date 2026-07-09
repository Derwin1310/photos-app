import { useAtomValue, useSetAtom } from "jotai";
import { useAuth0, type User } from "react-native-auth0";
import { useTranslation } from "react-i18next";
import {
  AUTH0_GOOGLE_CONNECTION,
  AUTH0_SCOPE,
  getAuth0Config,
} from "@/features/auth/auth-config";
import {
  authActionErrorAtom,
  authIsSigningInAtom,
  authIsSigningOutAtom,
} from "@/features/auth/auth-atoms";

export type AuthUser = {
  email?: string;
  id: string;
  name: string;
  picture?: string;
};

type AuthState = {
  errorMessage: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSigningIn: boolean;
  isSigningOut: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  user: AuthUser | null;
};

const normalizeUser = (
  user: User | null | undefined,
  fallbackName: string,
): AuthUser | null => {
  if (!user?.sub) {
    return null;
  }

  return {
    email: user.email,
    id: user.sub,
    name: user.name ?? user.nickname ?? user.email ?? fallbackName,
    picture: user.picture,
  };
};

const isCancelledAuthError = (error: unknown) =>
  error instanceof Error &&
  /cancel|cancelled|canceled|user.*closed|user.*cancel/i.test(error.message);

const getAuthErrorMessage = (error: unknown, fallback: string) => {
  if (isCancelledAuthError(error)) {
    return null;
  }

  return error instanceof Error ? error.message : fallback;
};

export const useAuth = (): AuthState => {
  const { authorize, clearSession, error, isLoading, user } = useAuth0();
  const { t } = useTranslation();
  const actionError = useAtomValue(authActionErrorAtom);
  const isSigningIn = useAtomValue(authIsSigningInAtom);
  const isSigningOut = useAtomValue(authIsSigningOutAtom);
  const setActionError = useSetAtom(authActionErrorAtom);
  const setIsSigningIn = useSetAtom(authIsSigningInAtom);
  const setIsSigningOut = useSetAtom(authIsSigningOutAtom);
  const authConfig = getAuth0Config();
  const authUser = normalizeUser(user, t("auth.defaultUser"));

  const signInWithGoogle = async () => {
    setIsSigningIn(true);
    setActionError(null);

    try {
      await authorize(
        {
          audience: authConfig.audience,
          connection: AUTH0_GOOGLE_CONNECTION,
          scope: AUTH0_SCOPE,
        },
        { customScheme: authConfig.scheme },
      );
    } catch (signInError) {
      setActionError(
        getAuthErrorMessage(signInError, t("auth.signInError")),
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    setIsSigningOut(true);
    setActionError(null);

    try {
      await clearSession({}, { customScheme: authConfig.scheme });
    } catch (signOutError) {
      setActionError(getAuthErrorMessage(signOutError, t("auth.signOutError")));
    } finally {
      setIsSigningOut(false);
    }
  };

  return {
    errorMessage: actionError ?? error?.message ?? null,
    isAuthenticated: Boolean(authUser),
    isLoading,
    isSigningIn,
    isSigningOut,
    signInWithGoogle,
    signOut,
    user: authUser,
  };
};
