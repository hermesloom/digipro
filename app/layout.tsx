import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/contexts/SessionContext";
import VorgaengeLoader from "./helpers/VorgaengeLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DIGIPRO",
  description: "Niederschrift über Durchsuchung, Sicherstellung, Beschlagnahme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <VorgaengeLoader>{children}</VorgaengeLoader>
        </SessionProvider>
      </body>
    </html>
  );
}
