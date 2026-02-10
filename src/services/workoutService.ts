import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  Timestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Workout, Exercise, ScheduledWorkout } from '@/types';

// Workouts CRUD
export const createWorkout = async (
  userId: string,
  name: string,
  exercises: Exercise[]
): Promise<string> => {
  const workoutData = {
    userId,
    name,
    exercises,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'workouts'), workoutData);
  return docRef.id;
};

export const getWorkouts = async (userId: string): Promise<Workout[]> => {
  const q = query(collection(db, 'workouts'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as Workout[];
};

export const updateWorkout = async (
  workoutId: string,
  name: string,
  exercises: Exercise[]
): Promise<void> => {
  const workoutRef = doc(db, 'workouts', workoutId);
  await updateDoc(workoutRef, {
    name,
    exercises,
    updatedAt: Timestamp.now(),
  });
};

export const deleteWorkout = async (workoutId: string): Promise<void> => {
  await deleteDoc(doc(db, 'workouts', workoutId));
  
  // Delete associated scheduled workouts
  const q = query(
    collection(db, 'scheduledWorkouts'),
    where('workoutId', '==', workoutId)
  );
  const querySnapshot = await getDocs(q);
  const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};

// Scheduled Workouts CRUD
export const scheduleWorkout = async (
  userId: string,
  workoutId: string,
  dayOfWeek: number
): Promise<void> => {
  // First, check if there's already a workout scheduled for this day
  const q = query(
    collection(db, 'scheduledWorkouts'),
    where('userId', '==', userId),
    where('dayOfWeek', '==', dayOfWeek)
  );
  const querySnapshot = await getDocs(q);

  // Delete existing scheduled workout for this day
  const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);

  // Add new scheduled workout
  await addDoc(collection(db, 'scheduledWorkouts'), {
    userId,
    workoutId,
    dayOfWeek,
    createdAt: Timestamp.now(),
  });
};

export const getScheduledWorkouts = async (
  userId: string
): Promise<ScheduledWorkout[]> => {
  const q = query(
    collection(db, 'scheduledWorkouts'),
    where('userId', '==', userId)
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  })) as ScheduledWorkout[];
};

export const removeScheduledWorkout = async (
  userId: string,
  dayOfWeek: number
): Promise<void> => {
  const q = query(
    collection(db, 'scheduledWorkouts'),
    where('userId', '==', userId),
    where('dayOfWeek', '==', dayOfWeek)
  );
  const querySnapshot = await getDocs(q);
  const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};

export const getWorkoutById = async (workoutId: string): Promise<Workout | null> => {
  const docRef = doc(db, 'workouts', workoutId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt.toDate(),
      updatedAt: docSnap.data().updatedAt.toDate(),
    } as Workout;
  }

  return null;
};
