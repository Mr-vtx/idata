import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import AuthProvider from "../components/AuthProvider";

export const metadata: Metadata = {
  title: "iData — File Storage Infrastructure",
  description:
    "Upload, store and stream files up to 2GB. Developer API included.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
