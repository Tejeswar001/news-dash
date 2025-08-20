import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { PreferencesProvider } from "@/contexts/preferences-context";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "NewsHub - Personalized News Dashboard",
  description: "Your personalized news dashboard with AI-powered insights",
  generator: "news-dash",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AuthProvider>
          <PreferencesProvider>
            <Navbar />
            <main className="min-h-screen bg-background">{children}</main>
          </PreferencesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
