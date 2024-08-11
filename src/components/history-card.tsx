import { Text } from "@gluestack-ui/themed";
import { HStack, Heading, VStack } from "@gluestack-ui/themed";

export function HistoryCard() {
  return (
    <HStack
      w="$full"
      px="$5"
      py="$4"
      mb="$3"
      bg="$gray600"
      rounded="$md"
      alignItems="center"
      justifyContent="space-between"
      gap="$5"
    >
      <VStack>
        <Heading
          color="$white"
          fontSize="$lg"
          textTransform="capitalize"
          fontFamily="$heading"
        >
          Costas
        </Heading>

        <Text color="$gray100" fontSize="$md" numberOfLines={1}>
          Puxada
        </Text>
      </VStack>

      <Text color="$gray300" fontSize="$md">
        08:56
      </Text>
    </HStack>
  );
}
