import { ExerciseCard } from "@components/excercise-card";
import { Group } from "@components/group";
import { HomeHeader } from "@components/home-header";
import { ToastMessage } from "@components/toast-message";
import { HStack, Heading, Text, VStack, useToast } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { PrivateRoutesNavigation } from "@routes/private.routes";
import { AppError } from "@utils/AppError";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { api } from "../lib";
import { ExerciseDTO } from "@dtos/exercise.dto";
import { Loading } from "@components/loading";

export function Home() {
  const navigation = useNavigation<PrivateRoutesNavigation>();
  const toast = useToast();

  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState("antebraço");

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate("exercise", { exerciseId });
  }

  async function fetchGroups() {
    try {
      const { data } = await api.get("/groups");
      setGroups(data);
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
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoadingExercises(true);
      const { data } = await api.get(`exercises/bygroup/${groupSelected}`);
      setExercises(data);
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
      setIsLoadingExercises(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    fetchExercisesByGroup();
  }, [groupSelected]);

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        horizontal
        renderItem={({ item }) => (
          <Group
            title={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32, gap: 8 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      {isLoadingExercises ? (
        <Loading />
      ) : (
        <VStack px="$8" flex={1}>
          <HStack justifyContent="space-between" alignItems="center" mb="$5">
            <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
              Exercícios
            </Heading>
            <Text color="$gray200" fontSize="$sm" fontFamily="$body">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <ExerciseCard
                onPress={() => handleOpenExerciseDetails(String(item.id))}
                exercise={item}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      )}
    </VStack>
  );
}
