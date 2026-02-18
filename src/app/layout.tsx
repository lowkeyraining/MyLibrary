// app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/main-layout";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
});

const thai = IBM_Plex_Sans_Thai({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-thai",
});

export const metadata: Metadata = {
  title: "My Library — Reading Tracker",
  description: "Personal book library management program",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${jakarta.variable} ${thai.variable} font-sans antialiased bg-[#FAF9F6] text-[#5C4033]`}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}