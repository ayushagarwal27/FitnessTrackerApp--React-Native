import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "@/components/general/Themed";

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Text>WorkoutScreen {id}</Text>
    </View>
  );
}
