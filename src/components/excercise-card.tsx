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

type ExerciseCardParams = TouchableOpacityProps;

export function ExerciseCard({ ...rest }: ExerciseCardParams) {
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
            uri: "https://www.shutterstock.com/image-vector/smiling-grandparents-doing-morning-exercises-600nw-2314906171.jpg",
          }}
          alt="Exercise image"
          w="$16"
          h="$16"
          rounded="$md"
          resizeMode="cover"
        />

        <VStack flex={1} gap="$1">
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
            Alongamento
          </Heading>
          <Text fontSize="$sm" color="$gray200" numberOfLines={2}>
            3 séries x 12 repetições
          </Text>
        </VStack>

        <Icon as={ChevronRight} color="$gray300" />
      </HStack>
    </TouchableOpacity>
  );
}
