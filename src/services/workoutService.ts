import {
  ExerciseSet,
  ExerciseWithSets,
  WorkoutWithExercises,
} from "@/types/models";
import * as Crypto from "expo-crypto";

export const getSetTotalWeight = (set: ExerciseSet) => {
  return (set.weight || 0) * (set?.reps || 0);
};

export const getExerciseTotalWeight = (exercise: ExerciseWithSets) => {
  return exercise.sets.reduce(
    (totalSetWeight, set) => totalSetWeight + getSetTotalWeight(set),
    0
  );
};

export const getWorkoutTotalWeight = (workout: WorkoutWithExercises) => {
  return workout.exercises.reduce(
    (total, exercise) => total + getExerciseTotalWeight(exercise),
    0
  );
};

export const getBestSet = (sets: ExerciseSet[]) => {
  return sets.reduce(
    (bestSet: ExerciseSet | null, currSet) =>
      (currSet?.oneRM || 0) > (bestSet?.oneRM || 0) ? currSet : bestSet,
    null
  );
};

export const generateNewWorkout = () => {
  return {
    id: Crypto.randomUUID(),
    createdAt: new Date(),
    finishedAt: null,
    exercises: [],
  };
};

export const finishWorkout = (workout: WorkoutWithExercises) => {
  return {
    ...workout,
    finishedAt: new Date(),
  };
};

export const createExercise = (name: string, workoutId: string) => {
  const newExercise: ExerciseWithSets = {
    id: Crypto.randomUUID(),
    name,
    workoutId,
    sets: [],
  };
  return newExercise;
};
