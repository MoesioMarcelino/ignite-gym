import { ExerciseDTO } from "@dtos/exercise.dto";
import { Text } from "@gluestack-ui/themed";
import { HStack, Heading, VStack } from "@gluestack-ui/themed";
import { formateDateTime } from "@utils/formatDateTime";

type HystoryCardProps = { data: ExerciseDTO };

export function HistoryCard({ data }: HystoryCardProps) {
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
      <VStack flex={1}>
        <Heading
          color="$white"
          fontSize="$lg"
          textTransform="capitalize"
          fontFamily="$heading"
          numberOfLines={1}
        >
          {data.name}
        </Heading>

        <Text color="$gray100" fontSize="$md" numberOfLines={1}>
          {data.group}
        </Text>
      </VStack>

      <Text color="$gray300" fontSize="$md">
        {formateDateTime(data.created_at)}
      </Text>
    </HStack>
  );
}
