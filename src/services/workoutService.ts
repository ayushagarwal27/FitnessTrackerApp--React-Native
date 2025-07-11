import {
  deleteExercise,
  getCurrentWorkout,
  getExercises,
  getWorkouts,
  saveExercise,
  saveWorkout,
} from "@/db";
import {
  ExerciseSet,
  ExerciseWithSets,
  Workout,
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

export const generateNewWorkout = async () => {
  const workout = {
    id: Crypto.randomUUID(),
    createdAt: new Date(),
    finishedAt: null,
    exercises: [],
  };
  await saveWorkout(workout);

  return workout;
};

export const finishWorkout = async (workout: WorkoutWithExercises) => {
  const finishedWorkout = {
    ...cleanWorkout(workout),
    finishedAt: new Date(),
  };
  await saveWorkout(finishedWorkout);

  return finishedWorkout;
};

export const createExercise = async (name: string, workoutId: string) => {
  const newExercise: ExerciseWithSets = {
    id: Crypto.randomUUID(),
    name,
    workoutId,
    sets: [],
  };

  const emptySet = createSet(newExercise.id);
  newExercise.sets.push(emptySet);
  await saveExercise(newExercise);
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

const isSetComplete = (set: ExerciseSet) => {
  return set.reps && set.reps > 0;
};

export const cleanSets = (sets: ExerciseSet[]) => {
  return sets.filter(isSetComplete);
};

export const cleanExercise = (exercise: ExerciseWithSets) => {
  const cleanedSets = cleanSets(exercise.sets);
  if (cleanedSets.length === 0) return null;
  deleteExercise(exercise.id);
  return { ...exercise, sets: cleanedSets };
};

export const cleanWorkout = (
  workout: WorkoutWithExercises
): WorkoutWithExercises => {
  const cleanedExercises = workout.exercises
    .map(cleanExercise)
    .filter((e) => e !== null);

  return { ...workout, exercises: cleanedExercises };
};

const addExercisesToWorkout = async (
  workout: Workout
): Promise<WorkoutWithExercises> => {
  const exercises = await getExercises(workout.id);
  return { ...workout, exercises: exercises.map((e) => ({ ...e, sets: [] })) };
};

export const getCurrentWorkoutWithExercises =
  async (): Promise<WorkoutWithExercises | null> => {
    const workout = await getCurrentWorkout();
    if (workout) {
      return await addExercisesToWorkout(workout);
    }
    return workout;
  };

export const getWorkoutsWithExercises = async (): Promise<
  WorkoutWithExercises[]
> => {
  const workouts = await getWorkouts();
  const workoutWithExercises = await Promise.all(
    workouts.map(addExercisesToWorkout)
  );
  return workoutWithExercises;
};
