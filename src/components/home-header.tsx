import {
  HStack,
  VStack,
  Heading,
  Text,
  Icon,
  Pressable,
} from "@gluestack-ui/themed";
import { ProfilePhoto } from "./profile-photo";
import { LogOut } from "lucide-react-native";
import { useAuth } from "@hooks/useAuth";

import userProfileDefault from "@assets/userPhotoDefault.png";

export function HomeHeader() {
  const { signOut, user } = useAuth();

  return (
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
      <ProfilePhoto
        source={user.avatar ? { uri: user.avatar } : userProfileDefault}
        alt="Profile photo"
        h="$16"
        w="$16"
      />
      <VStack flex={1}>
        <Text color="$gray100" fontSize="$sm">
          Olá,
        </Text>
        <Heading color="$gray100" fontSize="$md">
          {user.name}
        </Heading>
      </VStack>

      <Pressable onPress={signOut}>
        <Icon as={LogOut} color="$gray200" size="xl" />
      </Pressable>
    </HStack>
  );
}
