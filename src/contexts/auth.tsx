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
  storageSaveUser,
} from "@storage/user";
import {
  storageCleanToken,
  storageGetToken,
  storageSaveToken,
} from "@storage/token";

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

  async function updateStorages(user: UserDTO, token: string) {
    try {
      setIsLoadingStorageUserData(true);
      await storageSaveUser(user);
      await storageSaveToken(token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageUserData(false);
    }
  }

  async function cleanStorages() {
    try {
      setIsLoadingStorageUserData(true);
      await storageCleanUser();
      await storageCleanToken();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageUserData(false);
    }
  }

  function updateUserAndAsignAPIToken(user: UserDTO, token = "") {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
  }

  async function signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      const { data } = await api.post("/sessions", { email, password });

      if (data.user && data.token) {
        setUser(data.user);
        updateStorages(data.user, data.token);
      }
    } catch (error) {
      throw error;
    }
  }

  async function loadInitialData() {
    try {
      setIsLoadingStorageUserData(true);
      const user = await storageGetUser();
      const token = await storageGetToken();
      updateUserAndAsignAPIToken(user, token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageUserData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingStorageUserData(true);
      await cleanStorages();
      updateUserAndAsignAPIToken({} as UserDTO);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageUserData(false);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        loadUser: loadInitialData,
        signOut,
        isLoadingStorageUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
