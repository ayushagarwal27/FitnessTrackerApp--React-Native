import WorkoutExerciseItem from "@/components/logger/WorkoutExerciseItem";
import React from "react";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack } from "expo-router";
import CustomButton from "@/components/general/CustomButton";
import WorkoutHeader from "@/components/logger/WorkoutHeader";
import SelectExerciseModal from "@/components/logger/SelectExerciseModal";

export default function CurrentWorkoutScreen() {
  const headerHeight = useHeaderHeight();
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <CustomButton
              title="Finish"
              style={{ padding: 7, width: "auto", paddingHorizontal: 15 }}
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
          data={[1, 2, 3]}
          contentContainerStyle={{ gap: 10, padding: 10 }}
          renderItem={({ item }) => <WorkoutExerciseItem />}
          ListHeaderComponent={<WorkoutHeader />}
          ListFooterComponent={
            <SelectExerciseModal
              onSelectExercise={(name) => {
                console.log(name, "selected");
              }}
            />
          }
        />
      </KeyboardAvoidingView>
    </>
  );
}
