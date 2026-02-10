export interface User {
  uid: string;
  email: string;
  displayName: string; // Agora é obrigatório, não opcional
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  exercises: Exercise[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduledWorkout {
  id: string;
  userId: string;
  workoutId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  createdAt: Date;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WeekSchedule {
  [key: number]: Workout | null;
}