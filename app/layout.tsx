import type { Metadata } from "next";
import { Bebas_Neue, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./root-layout-client";

const displayFont = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "shoe-otah Boutique",
  description: "shoe-otah ecommerce storefront",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
