import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/context/CartContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ExtensionHydrationFix } from "@/components/ExtensionHydrationFix";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechShop — Computer Store & Hardware Ecommerce",
  description: "High-performance gaming laptops, GPUs, processors, and workstations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body
          suppressHydrationWarning
          className="min-h-full flex flex-col bg-background text-foreground selection:bg-blue-600 selection:text-white"
        >
          <ExtensionHydrationFix />
          <QueryProvider>
            <ThemeProvider>
              <CartProvider>{children}</CartProvider>
            </ThemeProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
