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
  isLoadingStorageUserData: boolean;
  signIn(props: { email: string; password: string }): Promise<void>;
  signOut(): void;
  updateUser(user: UserDTO): Promise<void>;
};

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState({} as UserDTO);
  const [isLoadingStorageUserData, setIsLoadingStorageUserData] =
    useState(true);

  async function updateUser(user: UserDTO) {
    try {
      setUser(user);
      await storageSaveUser(user);
    } catch (error) {
      throw error;
    }
  }

  async function updateStorages(user: UserDTO, token: string) {
    try {
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
        updateUserAndAsignAPIToken(data.user, data.token);
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
      setUser({} as UserDTO);
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
        isLoadingStorageUserData,
        signIn,
        updateUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
