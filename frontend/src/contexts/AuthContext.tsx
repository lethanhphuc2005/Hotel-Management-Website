import { createContext, useContext } from "react";
import { IAuthContextType } from "@/types/iuser";

// Tạo context rỗng ban đầu
export const AuthContext = createContext<IAuthContextType | undefined>(undefined);

// Hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
};
