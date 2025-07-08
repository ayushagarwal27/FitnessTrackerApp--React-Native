import React from "react";
import Card from "@/components/general/Card";
import { Text, View } from "@/components//general/Themed";
import { StyleSheet } from "react-native";
import SetItem from "./SetItem";
import { ExerciseSet, ExerciseWithSets } from "@/types/models";
import CustomButton from "../general/CustomButton";

export default function WorkoutExerciseItem({
  exercise,
}: {
  exercise: ExerciseWithSets;
}) {
  const sets = exercise.sets;

  return (
    <Card title={exercise.name}>
      <View style={styles.header}>
        <Text style={styles.setNumber}>Set</Text>
        <Text style={styles.setInfo}>kg</Text>
        <Text style={styles.setInfo}>Reps</Text>
      </View>
      <View style={{ gap: 5 }}>
        {sets.map((set, idx) => {
          return <SetItem key={set.id} index={idx} set={set} />;
        })}
      </View>
      <CustomButton
        title="+ Add Set"
        type="link"
        onPress={() => {
          console.log("adding set");
        }}
        style={{ padding: 10, marginTop: 10 }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    marginVertical: 10,
    gap: 5,
  },
  setNumber: {
    marginRight: "auto",
    fontWeight: "bold",
  },
  setInfo: {
    width: 60,
    textAlign: "center",
    fontWeight: "bold",
  },
});
