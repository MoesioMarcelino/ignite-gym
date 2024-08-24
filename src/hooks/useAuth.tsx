import { AuthContext } from "@contexts/auth";
import { AppError } from "@utils/AppError";
import { useContext } from "react";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new AppError(
      "useAuth should not be used without AuthProvider wrapper"
    );
  }

  return context;
}
