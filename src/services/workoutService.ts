import {
  ExerciseSet,
  ExerciseWithSets,
  WorkoutWithExercises,
} from "@/types/models";

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
