import { UserDTO } from "@dtos/user.dto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_STORAGE } from "./storage-config";

export async function storageUserSave(user: UserDTO) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export async function storageGetUser() {
  const user = await AsyncStorage.getItem(USER_STORAGE);

  const parsedUser: UserDTO = user ? JSON.parse(user) : {};
  return parsedUser;
}

export async function storageCleanUser() {
  await AsyncStorage.removeItem(USER_STORAGE);
}
