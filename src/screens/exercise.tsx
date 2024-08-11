import {
  VStack,
  Icon,
  HStack,
  Heading,
  Text,
  Image,
  Box,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { PrivateRoutesNavigation } from "@routes/private.routes";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";

import BodyIcon from "@assets/body.svg";
import SeriesIcon from "@assets/series.svg";
import RepetitionsIcon from "@assets/repetitions.svg";
import { Button } from "@components/button";

export function Exercise() {
  const navigation = useNavigation<PrivateRoutesNavigation>();

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          mb="$8"
        >
          <Heading
            color="$gray100"
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            Puxada frontal
          </Heading>
          <HStack alignItems="center" gap="$1">
            <BodyIcon />

            <Text color="$gray200" textTransform="capitalize">
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <VStack p="$8" gap="$3">
          <Image
            source={{
              uri: "https://www.shutterstock.com/image-vector/smiling-grandparents-doing-morning-exercises-600nw-2314906171.jpg",
            }}
            alt="Exercise"
            w="$full"
            h="$80"
            rounded="$lg"
            resizeMode="cover"
          />

          <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
            <HStack
              alignItems="center"
              justifyContent="space-around"
              mb="$6"
              mt="$5"
            >
              <HStack gap="$2" alignItems="center">
                <SeriesIcon />
                <Text color="$gray200">3 séries</Text>
              </HStack>
              <HStack gap="$2" alignItems="center">
                <RepetitionsIcon />
                <Text color="$gray200">12 repetições</Text>
              </HStack>
            </HStack>

            <Button title="Marcar como realizado" />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
