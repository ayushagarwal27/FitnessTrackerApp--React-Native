import { DbExercise, DbWorkout } from "@/types/db";
import { Exercise, Workout } from "@/types/models";
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export const dbName = "workoutTracker.db";

const createWorkoutsTableQuery = `
  CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY, 
    created_at TEXT, 
    finished_at TEXT
  );`;

export const createExercisesTableQuery = `
  CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY, 
    workout_id TEXT, 
    name TEXT, 
    FOREIGN KEY (workout_id) REFERENCES workouts (id)
  );`;

export const getDB = async () => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(dbName);
  // setup tables
  await db.withTransactionAsync(async () => {
    if (!db) return;
    await db.execAsync(createWorkoutsTableQuery);
    await db.execAsync(createExercisesTableQuery);
  });
  return db;
};

export const saveWorkout = async (workout: Workout) => {
  try {
    const db = await getDB();
    const res = await db.runAsync(
      "INSERT OR REPLACE INTO workouts(id, created_at, finished_at) VALUES(?, ?, ?)",
      workout.id,
      workout.createdAt.toISOString(),
      workout.finishedAt ? workout.finishedAt.toISOString() : null
    );
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const parseWorkout = (workout: DbWorkout): Workout => {
  return {
    id: workout.id,
    createdAt: new Date(workout.created_at),
    finishedAt: workout.finished_at ? new Date(workout.finished_at) : null,
  };
};

export const getCurrentWorkout = async (): Promise<Workout | null> => {
  try {
    const db = await getDB();

    const workout = await db.getFirstAsync<DbWorkout>(`
        SELECT * FROM workouts
        WHERE finished_at IS NULL
        ORDER BY created_at DESC 
        LIMIT 1
      `);

    if (!workout) return null;

    return parseWorkout(workout);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getWorkouts = async (): Promise<Workout[]> => {
  try {
    const db = await getDB();
    const workouts = await db.getAllAsync<DbWorkout>(`
        SELECT * FROM workouts
        WHERE finished_at IS NOT NULL
        ORDER BY created_at DESC
      `);
    return workouts.map(parseWorkout);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const saveExercise = async (exercise: Exercise) => {
  try {
    const db = await getDB();
    const res = await db.runAsync(
      "INSERT  INTO exercises(id, workout_id, name) VALUES(?, ?, ?)",
      exercise.id,
      exercise.workoutId,
      exercise.name
    );
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const parseExercise = (exercise: DbExercise): Exercise => {
  return {
    id: exercise.id,
    workoutId: exercise.workout_id,
    name: exercise.name,
  };
};

export const getExercises = async (workoutId: string): Promise<Exercise[]> => {
  try {
    const db = await getDB();
    const exercises = await db.getAllAsync<DbExercise>(
      `
        SELECT * FROM exercises
        WHERE workout_id = ?
      `,
      workoutId
    );
    return exercises.map(parseExercise);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const deleteExercise = async (exerciseID: string) => {
  try {
    const db = await getDB();
    await db.runAsync("DELETE FROM exercises WHERE id=?", exerciseID);
  } catch (error) {
    console.log(error);
  }
};
