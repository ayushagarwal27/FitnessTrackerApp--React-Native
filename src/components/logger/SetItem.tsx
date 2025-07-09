import React, { useState } from "react";
import { Text, TextInput, View } from "../general/Themed";
import { ExerciseSet } from "@/types/models";
import { StyleSheet } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import CustomButton from "../general/CustomButton";
import { useWorkouts } from "@/store";

interface SetItemProps {
  index: number;
  set: ExerciseSet;
}

export default function SetItem({ index, set }: SetItemProps) {
  const [weight, setWeight] = useState(set.weight?.toString() || "");
  const [reps, setReps] = useState(set.reps?.toString() || "");

  const updateSet = useWorkouts((state) => state.updateSet);
  const deleteSet = useWorkouts((state) => state.deleteSet);

  const handleWeightChange = () => {
    updateSet(set.id, { weight: parseFloat(weight) });
  };
  const handleRepsChange = () => {
    updateSet(set.id, { reps: parseInt(reps) });
  };

  const renderRightActions = () => (
    <CustomButton
      title="Delete"
      style={{ width: "auto", padding: 5 }}
      type="link"
      color="crimson"
      onPress={() => {
        deleteSet(set.id);
      }}
    />
  );
  return (
    <ReanimatedSwipeable renderRightActions={renderRightActions}>
      <View style={styles.container}>
        <Text style={styles.setNumber}>{index + 1}</Text>
        <TextInput
          placeholder="50"
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          onBlur={handleWeightChange}
        />
        <TextInput
          placeholder="8"
          style={styles.input}
          value={reps}
          onChangeText={setReps}
          keyboardType="number-pad"
          onBlur={handleRepsChange}
        />
      </View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 5, alignItems: "center" },
  setNumber: { marginRight: "auto", fontWeight: "bold", fontSize: 16 },
  input: {
    width: 60,
    textAlign: "center",
    padding: 5,
    paddingVertical: 7,
    fontSize: 16,
  },
});
