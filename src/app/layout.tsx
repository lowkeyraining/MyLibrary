import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "My Library - Reading Tracker",
  description: "ระบบติดตามการอ่านหนังสือของคุณ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${plusJakartaSans.variable} ${ibmPlexSansThai.variable} font-sans bg-[#FAF9F6] text-[#5C4033] antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}