import { ExerciseWithSets } from "@/types/models";
import Card from "@/components/general/Card";
import { Text, View } from "@/components/general/Themed";
import { StyleSheet } from "react-native";
import { getBestSet } from "@/services/workoutService";
import Colors from "@/constants/Colors";

interface WorkoutExerciseItemProps {
  exercise: ExerciseWithSets;
}

export default function WorkoutExerciseItem({
  exercise,
}: WorkoutExerciseItemProps) {
  const bestSet = getBestSet(exercise.sets);

  return (
    <Card title={exercise.name}>
      {exercise.sets.map((set, idx) => (
        <View
          style={[
            styles.setRow,
            {
              backgroundColor:
                set.id === bestSet?.id
                  ? Colors.dark.tint + "50"
                  : "transparent",
            },
          ]}
          key={set.id}
        >
          <Text style={styles.setIndex}>{idx + 1}</Text>
          <Text style={styles.setInfo}>
            {set.reps} {set.weight ? `x ${set.weight} kg` : "reps"}
          </Text>
          <Text style={[styles.setInfo, styles.setOneRm]}>
            {set.oneRM ? `${Math.floor(set.oneRM)} kg` : ""}
          </Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  setRow: { flexDirection: "row", gap: 15, padding: 8 },
  setIndex: { fontSize: 16, color: "gray" },
  setInfo: { fontSize: 16 },
  setOneRm: {
    marginLeft: "auto",
    fontWeight: "bold",
  },
});
