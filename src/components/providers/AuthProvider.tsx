"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Guide, Profile } from "@/lib/types";

type SignInResult = { error: string | null };

type AuthContextValue = {
  supabase: SupabaseClient;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  guide: Guide | null;
  isLoading: boolean;
  isOperator: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState<SupabaseClient>(() => createClient());

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfileFor = useCallback(
    async (userId: string) => {
      const [{ data: profileData }, { data: guideData }] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle<Profile>(),
        supabase
          .from("guides")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle<Guide>(),
      ]);
      setProfile(profileData ?? null);
      setGuide(guideData ?? null);
    },
    [supabase]
  );

  useEffect(() => {
    let active = true;

    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) {
        await loadProfileFor(data.session.user.id);
      }
      if (active) setIsLoading(false);
    }

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!active) return;
        setSession(nextSession);
        if (nextSession?.user) {
          void loadProfileFor(nextSession.user.id);
        } else {
          setProfile(null);
          setGuide(null);
        }
      }
    );

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase, loadProfileFor]);

  const signIn = useCallback<AuthContextValue["signIn"]>(
    async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  const signOut = useCallback<AuthContextValue["signOut"]>(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  const refreshProfile = useCallback<AuthContextValue["refreshProfile"]>(
    async () => {
      if (!session?.user) return;
      await loadProfileFor(session.user.id);
    },
    [session, loadProfileFor]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      supabase,
      session,
      user: session?.user ?? null,
      profile,
      guide,
      isLoading,
      isOperator: profile?.account_type === "operator",
      signIn,
      signOut,
      refreshProfile,
    }),
    [
      supabase,
      session,
      profile,
      guide,
      isLoading,
      signIn,
      signOut,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
