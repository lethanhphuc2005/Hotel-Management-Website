import { createContext, useContext } from "react";
import { IAuthContextType } from "@/types/user";

// Tạo context rỗng ban đầu
export const AuthContext = createContext<IAuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
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
