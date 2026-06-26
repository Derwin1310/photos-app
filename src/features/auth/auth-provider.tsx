import type React from "react";
import { createContext, use, useState } from "react";
import { useAuth0, type User } from "react-native-auth0";
import {
  AUTH0_GOOGLE_CONNECTION,
  AUTH0_SCOPE,
  getAuth0Config,
} from "@/features/auth/auth-config";

export type AuthUser = {
  email?: string;
  id: string;
  name: string;
  picture?: string;
};

type AuthContextValue = {
  errorMessage: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSigningIn: boolean;
  isSigningOut: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = React.PropsWithChildren;

const normalizeUser = (user: User | null | undefined): AuthUser | null => {
  if (!user?.sub) {
    return null;
  }

  return {
    email: user.email,
    id: user.sub,
    name: user.name ?? user.nickname ?? user.email ?? "PicXplorer user",
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { authorize, clearSession, error, isLoading, user } = useAuth0();
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const authConfig = getAuth0Config();
  const authUser = normalizeUser(user);

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
        getAuthErrorMessage(signInError, "Could not sign in with Google."),
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
      setActionError(getAuthErrorMessage(signOutError, "Could not sign out."));
    } finally {
      setIsSigningOut(false);
    }
  };

  const value: AuthContextValue = {
    errorMessage: actionError ?? error?.message ?? null,
    isAuthenticated: Boolean(authUser),
    isLoading,
    isSigningIn,
    isSigningOut,
    signInWithGoogle,
    signOut,
    user: authUser,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
};

export function useAuth() {
  const value = use(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return value;
}
