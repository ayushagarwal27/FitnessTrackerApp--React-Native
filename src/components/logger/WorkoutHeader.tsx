import React, { useEffect, useState } from "react";
import { Text, View } from "../general/Themed";
import dummyWorkouts from "@/data/dummyWorkouts";
import { calculateDurationHourMinutes } from "@/utils/Time";
import { FontAwesome5 } from "@expo/vector-icons";

export default function WorkoutHeader() {
  const [timer, setTimer] = useState("0:00");

  const workout = dummyWorkouts[0];

  useEffect(() => {
    const interval = setInterval(() => {
      const duration = calculateDurationHourMinutes(
        new Date(workout.createdAt),
        new Date()
      );
      setTimer(duration);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [workout]);

  return (
    <View style={{ gap: 10, backgroundColor: "transparent" }}>
      <Text style={{ fontWeight: "bold", fontSize: 24 }}>Workout Tracker</Text>
      <Text style={{ fontSize: 18 }}>
        <FontAwesome5 name="clock" color={"gray"} size={18} /> {timer}
      </Text>
    </View>
  );
}
