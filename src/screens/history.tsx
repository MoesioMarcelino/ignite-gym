import { HistoryCard } from "@components/history-card";
import { ScreenHeader } from "@components/screen-header";
import { Heading, Text, VStack } from "@gluestack-ui/themed";
import { useState } from "react";
import { SectionList } from "react-native";

export function History() {
  const [exercises, setExercises] = useState([
    { title: "10.08.2024", data: ["Puxada frontal", "Remana unilateral"] },
    { title: "12.08.2024", data: ["Biceps"] },
    { title: "", data: [] },
  ]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico" />
      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={() => <HistoryCard />}
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
    </VStack>
  );
}
