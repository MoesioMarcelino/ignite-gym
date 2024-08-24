import { UserDTO } from "@dtos/user.dto";
import { AppError } from "@utils/AppError";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../lib";
import {
  storageCleanUser,
  storageGetUser,
  storageUserSave,
} from "@storage/user";

type AuthContextProps = {
  user: UserDTO;
  signIn(props: { email: string; password: string }): Promise<void>;
  loadUser(): void;
  signOut(): void;
  isLoadingStorageUserData: boolean;
};

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState({} as UserDTO);
  const [isLoadingStorageUserData, setIsLoadingStorageUserData] =
    useState(true);

  async function signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      const { data } = await api.post("/sessions", { email, password });

      if (data.user) {
        setUser(data.user);
        storageUserSave(data.user);
      }
    } catch (error) {
      throw error;
    }
  }

  async function loadUser() {
    try {
      setIsLoadingStorageUserData(true);
      const user = await storageGetUser();
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageUserData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingStorageUserData(true);
      await storageCleanUser();
      setUser({} as UserDTO);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageUserData(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        loadUser,
        signOut,
        isLoadingStorageUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
