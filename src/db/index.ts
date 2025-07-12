import { DbWorkout } from "@/types/db";
import { Workout } from "@/types/models";
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export const dbName = "workoutTracker.db";

const createWorkoutsTableQuery = `
  CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY, 
    created_at TEXT, 
    finished_at TEXT
  );`;

export const getDB = async () => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(dbName);
  // setup tables
  await db.execAsync(createWorkoutsTableQuery);
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
