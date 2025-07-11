import { getCurrentWorkout } from "@/db";
import {
  createExercise,
  createSet,
  finishWorkout,
  generateNewWorkout,
  getCurrentWorkoutWithExercises,
  getWorkoutsWithExercises,
  updateSet,
} from "@/services/workoutService";
import { ExerciseSet, WorkoutWithExercises } from "@/types/models";
import { current } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  currentWorkout: WorkoutWithExercises | null;
  workouts: WorkoutWithExercises[];
};
type Actions = {
  startWorkout: () => void;
  finishWorkout: () => void;
  addExercise: (name: string) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (
    setId: string,
    updatedFields: Pick<ExerciseSet, "reps" | "weight">
  ) => void;
  deleteSet: (setId: string) => void;
  loadWorkouts: () => void;
};

export const useWorkouts = create<State & Actions>()(
  immer((set, get) => ({
    // State
    currentWorkout: null,
    workouts: [],

    loadWorkouts: async () => {
      set({
        currentWorkout: await getCurrentWorkoutWithExercises(),
        workouts: await getWorkoutsWithExercises(),
      });
    },

    // Actions
    startWorkout: async () => {
      const newWorkout: WorkoutWithExercises = await generateNewWorkout();
      set({ currentWorkout: newWorkout });
    },

    finishWorkout: async () => {
      const currentWorkout = get().currentWorkout;
      if (!currentWorkout) return;

      const finishedWorkout = await finishWorkout(currentWorkout);

      set((state) => {
        state.currentWorkout = null;
        state.workouts.push(finishedWorkout);
      });
    },

    addExercise: async (name) => {
      const currentWorkout = get().currentWorkout;
      if (!currentWorkout) return;
      const newExercise = await createExercise(name, currentWorkout.id);
      set((state) => {
        state.currentWorkout?.exercises.push(newExercise);
      });
    },

    addSet: (exerciseId) => {
      const newSet = createSet(exerciseId);

      set((state) => {
        state.currentWorkout?.exercises
          .find((exercise) => exercise.id === exerciseId)
          ?.sets.push(newSet);
      });
    },

    updateSet: (setId, updatedFields) => {
      set(({ currentWorkout }) => {
        const currentExercise = currentWorkout?.exercises?.find((ex) =>
          ex.sets?.some((st) => st.id === setId)
        );

        const setIndex = currentExercise?.sets?.findIndex(
          (st) => st.id === setId
        );

        if (setIndex === undefined || setIndex === -1 || !currentExercise)
          return;

        const updatedSet = updateSet(
          current(currentExercise.sets[setIndex]),
          updatedFields
        );

        currentExercise.sets[setIndex] = updatedSet;
      });
    },

    deleteSet: (setId) => {
      set(({ currentWorkout }) => {
        if (!currentWorkout) return;
        const currentExercise = currentWorkout?.exercises?.find((ex) =>
          ex.sets?.some((st) => st.id === setId)
        );
        if (!currentExercise) return;
        currentExercise.sets = currentExercise.sets?.filter(
          (st) => st.id !== setId
        );

        if (currentExercise.sets.length === 0) {
          currentWorkout.exercises = currentWorkout?.exercises?.filter(
            (ex) => ex.id !== currentExercise.id
          );
        }
      });
    },
  }))
);
