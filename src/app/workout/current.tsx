import WorkoutExerciseItem from "@/components/logger/WorkoutExerciseItem";
import React from "react";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Redirect, Stack } from "expo-router";
import CustomButton from "@/components/general/CustomButton";
import WorkoutHeader from "@/components/logger/WorkoutHeader";
import SelectExerciseModal from "@/components/logger/SelectExerciseModal";
import { useWorkouts } from "@/store";

export default function CurrentWorkoutScreen() {
  const headerHeight = useHeaderHeight();
  const currentWorkout = useWorkouts((state) => state.currentWorkout);
  const finishWorkout = useWorkouts((state) => state.finishWorkout);
  const addExercise = useWorkouts((state) => state.addExercise);

  if (!currentWorkout) {
    return <Redirect href={"/"} />;
  }
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <CustomButton
              title="Finish"
              style={{ padding: 7, width: "auto", paddingHorizontal: 15 }}
              onPress={finishWorkout}
            />
          ),
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight}
      >
        <FlatList
          data={currentWorkout.exercises}
          contentContainerStyle={{ gap: 10, padding: 10 }}
          renderItem={({ item }) => <WorkoutExerciseItem exercise={item} />}
          ListHeaderComponent={<WorkoutHeader />}
          ListFooterComponent={
            <SelectExerciseModal
              onSelectExercise={(name) => {
                addExercise(name);
              }}
            />
          }
        />
      </KeyboardAvoidingView>
    </>
  );
}
