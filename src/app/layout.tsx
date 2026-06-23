import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "./providers";
import { ThemeInitScript } from "@/components/ThemeInitScript";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CareerOS AI — Your AI-Powered Career Operating System",
    template: "%s | CareerOS AI",
  },
  description:
    "Discover career paths, improve resumes, practice interviews, and get personalized AI mentorship — all in one intelligent platform.",
  keywords: [
    "career",
    "AI",
    "resume analyzer",
    "mock interview",
    "career mentor",
    "skill gap",
    "learning roadmap",
  ],
  openGraph: {
    title: "CareerOS AI — Your AI-Powered Career Operating System",
    description:
      "Discover career paths, improve resumes, practice interviews, and get personalized AI mentorship.",
    type: "website",
    locale: "en_US",
    siteName: "CareerOS AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerOS AI",
    description:
      "Your AI-Powered Career Operating System",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeInitScript />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

