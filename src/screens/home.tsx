import { Group } from "@components/group";
import { HomeHeader } from "@components/home-header";
import { VStack } from "@gluestack-ui/themed";
import { useState } from "react";
import { FlatList } from "react-native";

export function Home() {
  const [groups, setGroups] = useState([
    "Costas",
    "Ombros",
    "Bíceps",
    "Abs",
    "Quadríceps",
  ]);
  const [groupSelected, setGroupSelected] = useState("");

  return (
    <VStack>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        horizontal
        renderItem={({ item }) => (
          <Group
            title={item}
            isActive={groupSelected === item}
            onPress={() => setGroupSelected(item)}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32, gap: 8 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />
    </VStack>
  );
}
