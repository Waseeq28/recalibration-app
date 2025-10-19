import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { Linking } from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/database/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (!error) {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const handleDeepLink = async (url: string) => {
      if (url.includes("access_token")) {
        try {
          const urlObj = new URL(url.replace("#", "?"));
          const accessToken = urlObj.searchParams.get("access_token");
          const refreshToken = urlObj.searchParams.get("refresh_token");

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          }
        } catch (error) {}
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    const linkingSubscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      linkingSubscription?.remove();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/(home)");
    } catch (error) {}
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
