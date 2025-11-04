"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/integrations/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

interface SessionContextType {
  supabase: SupabaseClient;
  session: Session | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider = ({ children }: { children: ReactNode }) => {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/forgot-password", "/creators"];
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (currentSession) {
          setSession(currentSession);
          if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
            // Redirect authenticated users away from auth pages
            if (pathname.startsWith("/auth")) {
              router.push("/dashboard/profile"); // Default dashboard for now
            }
          }
        } else {
          setSession(null);
          // Redirect unauthenticated users to login if they are on a protected path
          if (!publicPaths.some(path => pathname.startsWith(path))) {
            router.push("/auth/login");
            toast.error("Please log in to access this page.");
          }
        }
        setIsLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setIsLoading(false);
      if (initialSession && pathname.startsWith("/auth")) {
        router.push("/dashboard/profile"); // Redirect if already logged in and on auth page
      } else if (!initialSession && !publicPaths.some(path => pathname.startsWith(path))) {
        router.push("/auth/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading application...</p>
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ supabase, session, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionContextProvider");
  }
  return context;
};