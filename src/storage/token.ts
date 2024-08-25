import { UserDTO } from "@dtos/user.dto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_STORAGE } from "./storage-config";

export async function storageSaveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_STORAGE, token);
}

export async function storageGetToken() {
  const token = await AsyncStorage.getItem(TOKEN_STORAGE);
  return token || "";
}

export async function storageCleanToken() {
  await AsyncStorage.removeItem(TOKEN_STORAGE);
}
