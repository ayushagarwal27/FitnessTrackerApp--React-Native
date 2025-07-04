import React from "react";
import Card from "@/components/general/Card";
import { Text, View } from "../general/Themed";
import { StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons/";
import { WorkoutWithExercises } from "@/types/models";
import dayjs from "dayjs";
import { getBestSet, getWorkoutTotalWeight } from "@/services/workoutService";
import { calculateDuration } from "@/utils/Time";

type WorkoutListItemProps = {
  workout: WorkoutWithExercises;
};

export default function WorkoutListItem({ workout }: WorkoutListItemProps) {
  return (
    <Card
      title={dayjs(workout.createdAt).format("HH:mm: dddd, D MMM")}
      style={{ gap: 8 }}
      href={`/workout/${workout.id}`}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold" }}>Exercise</Text>
        <Text style={{ fontWeight: "bold" }}>Best set</Text>
      </View>
      {workout.exercises.map((exercise, idx) => {
        const bestSet = getBestSet(exercise.sets);
        return (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
            key={idx}
          >
            <Text style={{ color: "gray" }}>
              {exercise.sets.length} x {exercise.name}
            </Text>
            {bestSet && (
              <Text style={{ color: "gray" }}>
                {bestSet.reps}{" "}
                {bestSet.weight ? `x ${bestSet.weight} kg` : "reps"}
              </Text>
            )}
          </View>
        );
      })}

      <View
        style={{
          flexDirection: "row",
          gap: 20,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "#333",
          marginTop: 10,
          paddingTop: 10,
        }}
      >
        <Text>
          <FontAwesome5 name="clock" size={16} color="gray" />{" "}
          {calculateDuration(workout.createdAt, workout.finishedAt)}
        </Text>
        <Text>
          <FontAwesome5 name="weight-hanging" size={16} color="gray" />{" "}
          {getWorkoutTotalWeight(workout)} kg
        </Text>
      </View>
    </Card>
  );
}
