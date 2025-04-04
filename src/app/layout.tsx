"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { useHealthDataUpdater } from "@/lib/useHealthDataUpdater";
import { GeistMono } from "geist/font/mono";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0F9E99",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useHealthDataUpdater();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ResiliChain - Urban Health Resilience Platform</title>
        <meta
          name="description"
          content="Visualizing Mumbai's environmental, disease, and mental health data"
        />
        <meta name="application-name" content="ResiliChain" />
        <meta name="theme-color" content="#0F9E99" />
      </head>
      <body
        className={`${inter.variable} ${GeistMono.variable} font-sans bg-background p-0`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="container mx-auto px-5 flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster richColors={true} />
        </ThemeProvider>
      </body>
    </html>
  );
}
