import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserRole = "fan" | "talent" | null;

interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  clearRole: () => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRoleState] = useState<UserRole>(null);

  useEffect(() => {
    // Load role from session storage on mount
    const storedRole = sessionStorage.getItem("user_role") as UserRole;
    if (storedRole) {
      setUserRoleState(storedRole);
    }
  }, []);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (role) {
      sessionStorage.setItem("user_role", role);
    } else {
      sessionStorage.removeItem("user_role");
    }
  };

  const clearRole = () => {
    setUserRoleState(null);
    sessionStorage.removeItem("user_role");
    sessionStorage.removeItem("talent_id");
    sessionStorage.removeItem("talent_handle");
  };

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole, clearRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
};
