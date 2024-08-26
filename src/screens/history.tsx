import { HistoryCard } from "@components/history-card";
import { ScreenHeader } from "@components/screen-header";
import { ToastMessage } from "@components/toast-message";
import { Heading, Text, VStack, useToast } from "@gluestack-ui/themed";
import { AppError } from "@utils/AppError";
import { useCallback, useEffect, useState } from "react";
import { SectionList } from "react-native";
import { api } from "../lib";
import { HistoryDTO } from "@dtos/history.dto";
import { useFocusEffect } from "@react-navigation/native";
import { Loading } from "@components/loading";

export function History() {
  const toast = useToast();

  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [exercises, setExercises] = useState<HistoryDTO[]>([]);

  async function fetchHistory() {
    try {
      setIsLoadingExercises(true);
      console.log("passando aqui");
      const { data } = await api.get("/history");
      setExercises(data);
    } catch (err) {
      const isAppError = err instanceof AppError;
      const title = isAppError
        ? err.message
        : "Erro ao carregar o histórico. Tente novamente mais tarde";

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

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico" />

      {isLoadingExercises ? (
        <Loading />
      ) : (
        <SectionList
          sections={exercises}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading
              color="$gray200"
              fontSize="$md"
              mt="$10"
              mb="$3"
              fontFamily="$heading"
            >
              {section.title}
            </Heading>
          )}
          style={{ paddingHorizontal: 32 }}
          contentContainerStyle={
            exercises.length === 0 && {
              flex: 1,
              justifyContent: "center",
            }
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text textAlign="center" color="$gray100">
              Não há exercícios registrados ainda.{"\n"} Vamos fazer exercícios
              hoje?
            </Text>
          )}
        />
      )}
    </VStack>
  );
}
