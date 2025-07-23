"use client";

// import { BackgroundBeams } from "@/components/ui/background-beams";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  // type is specified like this only
  const { session } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    // runs after the ui has been loaded
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (session) {
    // 	Prevents rendering the restricted page for already logged-in users, avoids UI flash.
    return null;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
      {/* <BackgroundBeams /> */}
      <div className="relative">{children}</div>
    </div>
  );
};

export default Layout;

/*
how change in session triggers re-render in the component using it:-
📍 session comes from Zustand’s state object defined inside useAuthStore.
📍 Zustand automatically updates this session when you call set() in login, verifySession, or logout.
📍 Your component is subscribed to the store’s updates.
*/
