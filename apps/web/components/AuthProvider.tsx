"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "../lib/store";

const PROTECTED = ["/dashboard", "/upload"];
const AUTH_ONLY = ["/login", "/register"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, hydrated, rehydrate } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    rehydrate();
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
    const isAuthOnly = AUTH_ONLY.includes(pathname);

    if (isProtected && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isAuthOnly && user) {
      router.replace("/dashboard");
      return;
    }
  }, [hydrated, user, pathname]);

  if (!hydrated) {
    return (
      <div className="page-loader">
        <div className="page-loader-logo">i</div>
        <div className="page-loader-bar" />
      </div>
    );
  }

  return <>{children}</>;
}
