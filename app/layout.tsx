import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

import { Providers } from './providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Các Sản phẩm tiện lợi Đang Giảm Giá, Miễn phí, free vouchers, free product",
  description: "Tập hợp các sản phẩm giảm giá, voucher miễn phí trên các sàn điện tử nổi tiếng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >         
         <Providers>{children}</Providers>
         <Analytics />
      </body>
    </html>
  );
}
