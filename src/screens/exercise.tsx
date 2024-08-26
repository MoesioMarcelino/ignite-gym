import {
  VStack,
  Icon,
  HStack,
  Heading,
  Text,
  Image,
  Box,
  useToast,
} from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PrivateRoutesNavigation } from "@routes/private.routes";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";

import BodyIcon from "@assets/body.svg";
import SeriesIcon from "@assets/series.svg";
import RepetitionsIcon from "@assets/repetitions.svg";
import { Button } from "@components/button";
import { useEffect, useState } from "react";
import { ExerciseDTO } from "@dtos/exercise.dto";
import { api } from "../lib";
import { AppError } from "@utils/AppError";
import { ToastMessage } from "@components/toast-message";
import { Loading } from "@components/loading";

type RouteParams = {
  exerciseId: string;
};

export function Exercise() {
  const route = useRoute();
  const navigation = useNavigation<PrivateRoutesNavigation>();
  const toast = useToast();

  const [isLoadingExercise, setIsLoadingExercise] = useState(true);
  const [isLoadingMarkingExerciseDone, setIsLoadingMarkingExerciseDone] =
    useState(false);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);

  const { exerciseId } = route.params as RouteParams;

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseById() {
    try {
      setIsLoadingExercise(true);
      const { data } = await api.get(`exercises/${exerciseId}`);
      setExercise(data);
    } catch (err) {
      const isAppError = err instanceof AppError;
      const title = isAppError
        ? err.message
        : "Erro ao entrar. Tente novamente mais tarde";

      toast.show({
        placement: "top",
        containerStyle: { paddingTop: 32 },

        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setIsLoadingExercise(false);
    }
  }

  async function handleMarkExerciseAsDone() {
    try {
      setIsLoadingMarkingExerciseDone(true);
      await api.post(`history`, { exercise_id: exerciseId });

      toast.show({
        placement: "top",
        containerStyle: { paddingTop: 32 },

        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Exercício marcado como realizado com sucesso!"
            action="success"
            onClose={() => toast.close(id)}
          />
        ),
      });

      navigation.navigate("history");
    } catch (err) {
      const isAppError = err instanceof AppError;
      const title = isAppError
        ? err.message
        : "Erro ao entrar. Tente novamente mais tarde";

      toast.show({
        placement: "top",
        containerStyle: { paddingTop: 32 },

        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            action="error"
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setIsLoadingMarkingExerciseDone(false);
    }
  }

  useEffect(() => {
    fetchExerciseById();
  }, [exerciseId]);

  if (isLoadingExercise) {
    return <Loading />;
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
            {exercise.name}
          </Heading>
          <HStack alignItems="center" gap="$1">
            <BodyIcon />

            <Text color="$gray200" textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <VStack p="$8" gap="$3">
          <Box rounded="$lg" overflow="hidden">
            <Image
              source={{
                uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
              }}
              alt="Exercise"
              w="$full"
              h="$80"
              rounded="$lg"
              resizeMode="cover"
            />
          </Box>

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

            <Button
              title="Marcar como realizado"
              onPress={handleMarkExerciseAsDone}
              isLoading={isLoadingMarkingExerciseDone}
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
