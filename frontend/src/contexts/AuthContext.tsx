import { createContext, useContext } from "react";
import { AuthContextType } from "@/types/auth";

// Tạo context rỗng ban đầu
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  loginWithGoogle: async () => false, // 👈 Thêm dòng này
  logout: () => {},
});

// Hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
};
