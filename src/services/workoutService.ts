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

  const emptySet = createSet(newExercise.id);
  newExercise.sets.push(emptySet);
  return newExercise;
};

export const createSet = (exerciseId: string) => {
  const newSet: ExerciseSet = {
    id: Crypto.randomUUID(),
    exerciseId,
  };
  return newSet;
};

export const updateSet = (
  set: ExerciseSet,
  updatedFields: Pick<ExerciseSet, "weight" | "reps">
) => {
  const updatedSet = { ...set };
  if (updatedFields.reps !== undefined) {
    updatedSet.reps = updatedFields.reps;
  }
  if (updatedFields.weight !== undefined) {
    updatedSet.weight = updatedFields.weight;
  }

  if (updatedSet.weight !== undefined && updatedSet.reps !== undefined) {
    updatedSet.oneRM = updatedSet.weight * (36.0 / (37.0 - updatedSet.reps));
  }
  return updatedSet;
};
