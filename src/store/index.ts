import {
  createExercise,
  finishWorkout,
  generateNewWorkout,
} from "@/services/workoutService";
import { WorkoutWithExercises } from "@/types/models";
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
};

export const useWorkouts = create<State & Actions>()(
  immer((set, get) => ({
    // State
    currentWorkout: null,
    workouts: [],

    // Actions
    startWorkout: () => {
      const newWorkout: WorkoutWithExercises = generateNewWorkout();
      set({ currentWorkout: newWorkout });
    },

    finishWorkout: () => {
      const currentWorkout = get().currentWorkout;
      if (!currentWorkout) return;

      const finishedWorkout = finishWorkout(currentWorkout);

      set((state) => {
        state.currentWorkout = null;
        state.workouts.push(finishedWorkout);
      });
    },

    addExercise: (name: string) => {
      const currentWorkout = get().currentWorkout;
      if (!currentWorkout) return;
      const newExercise = createExercise(name, currentWorkout.id);
      set((state) => {
        state.currentWorkout?.exercises.push(newExercise);
      });
    },
  }))
);
