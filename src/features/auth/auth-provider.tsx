import { useAtom, useSetAtom } from "jotai";
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

type AuthSessionState = Pick<AuthState, "isAuthenticated" | "isLoading" | "user">;
type GoogleSignInState = Pick<
  AuthState,
  "errorMessage" | "isSigningIn" | "signInWithGoogle"
>;
type SignOutState = Pick<AuthState, "isSigningOut" | "signOut" | "user">;

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
  const authSession = useAuthSession();
  const googleSignIn = useGoogleSignIn();
  const signOutState = useSignOut();

  return {
    ...authSession,
    ...googleSignIn,
    ...signOutState,
    errorMessage: googleSignIn.errorMessage,
    isSigningOut: signOutState.isSigningOut,
    signOut: signOutState.signOut,
    user: authSession.user,
  };
};

export const useAuthSession = (): AuthSessionState => {
  const { isLoading, user } = useAuth0();
  const { t } = useTranslation();
  const authUser = normalizeUser(user, t("auth.defaultUser"));

  return {
    isAuthenticated: Boolean(authUser),
    isLoading,
    user: authUser,
  };
};

export const useGoogleSignIn = (): GoogleSignInState => {
  const { authorize, error } = useAuth0();
  const { t } = useTranslation();
  const [actionError, setActionError] = useAtom(authActionErrorAtom);
  const [isSigningIn, setIsSigningIn] = useAtom(authIsSigningInAtom);
  const authConfig = getAuth0Config();

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

  return {
    errorMessage: actionError ?? error?.message ?? null,
    isSigningIn,
    signInWithGoogle,
  };
};

export const useSignOut = (): SignOutState => {
  const { clearSession, user } = useAuth0();
  const { t } = useTranslation();
  const setActionError = useSetAtom(authActionErrorAtom);
  const [isSigningOut, setIsSigningOut] = useAtom(authIsSigningOutAtom);
  const authConfig = getAuth0Config();
  const authUser = normalizeUser(user, t("auth.defaultUser"));

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
    isSigningOut,
    signOut,
    user: authUser,
  };
};
