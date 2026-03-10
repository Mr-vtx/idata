import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iData Docs — API Reference",
  description: "Complete API documentation for iData file storage platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
