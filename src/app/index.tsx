import React from "react";
import { Link } from "expo-router";
import { View } from "@/components/general/Themed";
import CustomButton from "@/components/general/CustomButton";
import WorkoutListItem from "@/components/workouts/WorkoutListItem";
import workouts from "@/data/dummyWorkouts";
import { FlatList } from "react-native";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        gap: 10,
        padding: 10,
        backgroundColor: "transparent",
      }}
    >
      <Link href={"/workout/current"} asChild>
        <CustomButton title="Resume Workout" />
      </Link>

      <FlatList
        data={workouts}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => <WorkoutListItem workout={item} />}
      />
    </View>
  );
}
