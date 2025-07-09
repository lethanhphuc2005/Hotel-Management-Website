// app/ClientWrapper.tsx
"use client";

import { AuthProvider } from "@/providers/AuthProvider";
import ChatbotPopup from "@/components/modals/chatBotPopup";
import { LoadingProvider } from "@/contexts/LoadingContext";
import GlobalLoading from "@/components/layout/GlobalLoading";
import CartProvider from "@/providers/CartProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ToastContainer } from "react-toastify";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
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
        style={{ zIndex: 99999 }}
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
    </>
  );
}
