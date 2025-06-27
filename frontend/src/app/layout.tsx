import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "animate.css";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import "react-datepicker/dist/react-datepicker.css";
import { AuthProvider } from "@/providers/AuthProvider";
import ChatbotPopup from "@/components/modals/chatBotPopup";
import { LoadingProvider } from "@/contexts/LoadingContext";
import GlobalLoading from "@/components/layout/GlobalLoading";
import CartProvider from "@/providers/CartProvider";
import { ToastContainer } from "react-toastify";
import "@fontsource/playfair-display"; // Mặc định 400
import "@fontsource/poppins";
import "@fontsource/lora";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

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
    icon: "@public/favicon.ico",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* _app.tsx hoặc layout.tsx */}
        <link rel="preload" as="image" href="/img/banner1.webp" />
        <link rel="preload" as="image" href="/img/logo-doc.png" />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@400;600&family=Lora:wght@400;600&display=swap"
          rel="stylesheet"
        /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          draggable
          theme="colored"
          style={{ zIndex: 9999 }}
        />
        <LoadingProvider>
          <AuthProvider>
            <CartProvider>
              <GlobalLoading />
              <Header />
              {children}
              <Footer />
            </CartProvider>
          </AuthProvider>
          <ChatbotPopup />
        </LoadingProvider>
      </body>
    </html>
  );
}
