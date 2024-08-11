import { HStack, VStack, Heading, Text, Icon } from "@gluestack-ui/themed";
import { ProfilePhoto } from "./profile-photo";
import { LogOut } from "lucide-react-native";

export function HomeHeader() {
  return (
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
      <ProfilePhoto
        source={{ uri: "https://github.com/moesiomarcelino.png" }}
        alt="Profile photo"
        h="$16"
        w="$16"
      />
      <VStack flex={1}>
        <Text color="$gray100" fontSize="$sm">
          Olá,
        </Text>
        <Heading color="$gray100" fontSize="$md">
          Moésio Marcelino
        </Heading>
      </VStack>

      <Icon as={LogOut} color="$gray200" size="xl" />
    </HStack>
  );
}
