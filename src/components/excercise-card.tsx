import { ExerciseDTO } from "@dtos/exercise.dto";
import {
  HStack,
  Heading,
  Icon,
  Image,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { ChevronRight } from "lucide-react-native";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { api } from "../lib";

type ExerciseCardParams = TouchableOpacityProps & { exercise: ExerciseDTO };

export function ExerciseCard({ exercise, ...rest }: ExerciseCardParams) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        gap="$4"
        bg="$gray500"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${exercise.thumb}`,
          }}
          alt="Exercise image"
          w="$16"
          h="$16"
          rounded="$md"
          resizeMode="cover"
        />

        <VStack flex={1} gap="$1">
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
            {exercise.name}
          </Heading>
          <Text fontSize="$sm" color="$gray200" numberOfLines={2}>
            {exercise.series} séries x {exercise.repetitions} repetições
          </Text>
        </VStack>

        <Icon as={ChevronRight} color="$gray300" />
      </HStack>
    </TouchableOpacity>
  );
}
