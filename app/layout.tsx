import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { CookieConsent } from "@/components/shared/cookie-consent";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BrickMaster — Track & Share Your LEGO Collection",
  description:
    "Track your LEGO collection, discover new sets, and share your vault with friends. The personal collection tracker for LEGO enthusiasts.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <PostHogProvider>
            {children}
            <Toaster />
            <CookieConsent />
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
