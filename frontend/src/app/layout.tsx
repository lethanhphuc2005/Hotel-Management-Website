import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Be_Vietnam_Pro,
  Playfair_Display,
  Lora,
} from "next/font/google";
import "animate.css";
import "@/styles/base/globals.css";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ClientWrapper from "./ClientWrapper";

const beVietnam = Be_Vietnam_Pro({
  weight: ["400", "600"],
  subsets: ["vietnamese"],
  variable: "--font-vietnam",
});

const playfairDisplay = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["vietnamese"],
  variable: "--font-playfair-display",
});

const lora = Lora({
  weight: ["400", "700"],
  subsets: ["vietnamese"],
  variable: "--font-lora",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Moon Hotel",
  description: "Khách sạn The Moon - Nơi nghỉ dưỡng lý tưởng",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "The Moon Hotel",
    description: "Trải nghiệm nghỉ dưỡng sang trọng tại The Moon",
    url: "https://themoonhotel.xyz",
    siteName: "The Moon Hotel",
    images: [
      {
        url: "/img/banner.webp", // 👉 ảnh preview khi share
        width: 1200,
        height: 630,
        alt: "The Moon Hotel",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Moon Hotel",
    description: "Khách sạn The Moon - Nơi nghỉ dưỡng lý tưởng",
    images: ["/img/banner.webp"], // Twitter preview
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preload" as="image" href="/img/banner1.webp" />
        <link rel="preload" as="image" href="/img/logo-doc.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${beVietnam.variable} ${playfairDisplay.variable} ${lora.variable}`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
