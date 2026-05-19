import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_SHORT, APP_SLOGAN } from "@/lib/constants";
import { AppProviders } from "@/components/providers/app-providers";
import { AppShell } from "@/components/layout/app-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_SHORT} | Smart Provincial Governance`,
  description: `${APP_NAME} — ${APP_SLOGAN}`,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: APP_SHORT,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/zamboangasibugaylogo.png",
    apple: "/zamboangasibugaylogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preload" as="image" href="/zamboangasibugaylogo.png" fetchPriority="high" />
      </head>
      <body className="min-h-full overflow-x-hidden bg-slate-950 text-slate-200">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
