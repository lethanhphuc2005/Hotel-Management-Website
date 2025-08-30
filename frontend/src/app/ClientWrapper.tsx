"use client";

import { AuthProvider } from "@/providers/AuthProvider";
import ChatbotPopup from "@/components/modals/chatBotPopup";
import { LoadingProvider } from "@/contexts/LoadingContext";
import GlobalLoading from "@/components/layout/GlobalLoading";
import CartProvider from "@/providers/CartProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Import Bootstrap JS khi client mount
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

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
            <ScrollToTop />
            <div className="tw-min-h-screen">{children}</div>
            <Footer />
            <ChatbotPopup />
          </CartProvider>
        </AuthProvider>
      </LoadingProvider>
    </>
  );
}
