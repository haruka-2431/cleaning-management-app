import { createContext, useContext, useState } from "react";

export type UserRole = "admin" | "worker" | "";

interface AuthContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//ユーザのロール管理
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>("");

  return (
    <AuthContext.Provider value={{ userRole, setUserRole }}>
      { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext)
  if(!context){
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};