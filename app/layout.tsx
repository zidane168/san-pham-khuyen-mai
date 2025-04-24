import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

import { Providers } from './providers';
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tập trung các sản phẩm tiện ích đang giảm giá, miễn phí, free vouchers, discount", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <Head>
        <meta name="description" content="Tập hợp các sản phẩm tiện nghi giảm giá, voucher miễn phí trên các sàn điện tử nổi tiếng, tiện nghi gia đình, tiện ích không ngờ, tiện ích gia đình" />
        <meta name="keywords" content="giảm giá, discount, voucher, miễn phí, sản phẩm tiện lợi, sản phẩm tiện ích, tiện ích không ngờ, san pham khuyen mai, tiện nghi gia đình" />
        <meta name="author" content="huuvi168@gmail.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://san-pham-khuyen-mai.vercel.app/" /> {/* Update with your site URL */}
      </Head>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >         
         <Providers>{children}</Providers>
         <Analytics />
      </body>
    </html>
  );
}
