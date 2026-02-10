import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Workout, Exercise } from "@/types";
import {
  createWorkout,
  getWorkouts,
  deleteWorkout,
  updateWorkout,
  scheduleWorkout,
  getScheduledWorkouts,
  getWorkoutById,
} from "@/services/workoutService";
import { WorkoutCard } from "@/components/workouts/WorkoutCard";
import { CreateWorkoutDialog } from "@/components/workouts/CreateWorkoutDialog";
import { AddExerciseDialog } from "@/components/workouts/AddExerciseDialog";
import { WeeklySchedule } from "@/components/schedule/WeeklySchedule";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Plus, LogOut } from "lucide-react";

export const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [schedule, setSchedule] = useState<{ [key: number]: Workout | null }>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [createWorkoutOpen, setCreateWorkoutOpen] = useState(false);
  const [addExerciseOpen, setAddExerciseOpen] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null,
  );
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    loadWorkouts();
    loadSchedule();
  }, [currentUser]);

  const loadWorkouts = async () => {
    if (!currentUser) return;

    try {
      const data = await getWorkouts(currentUser.uid);
      setWorkouts(data);
    } catch (error) {
      console.error("Error loading workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSchedule = async () => {
    if (!currentUser) return;

    try {
      const scheduledWorkouts = await getScheduledWorkouts(currentUser.uid);
      const scheduleMap: { [key: number]: Workout | null } = {};

      for (const scheduled of scheduledWorkouts) {
        const workout = await getWorkoutById(scheduled.workoutId);
        if (workout) {
          scheduleMap[scheduled.dayOfWeek] = workout;
        }
      }

      setSchedule(scheduleMap);
    } catch (error) {
      console.error("Error loading schedule:", error);
    }
  };

  const handleCreateWorkout = async (name: string) => {
    if (!currentUser) return;

    try {
      const newWorkoutId = await createWorkout(currentUser.uid, name, []);
      await loadWorkouts();
      setSelectedWorkoutId(newWorkoutId);
      setAddExerciseOpen(true);
    } catch (error) {
      console.error("Error creating workout:", error);
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    if (!confirm("Tem certeza que deseja excluir este treino?")) return;

    try {
      await deleteWorkout(workoutId);
      await loadWorkouts();
      await loadSchedule();
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  const handleAddExercise = async (exercise: Omit<Exercise, "id">) => {
    if (!currentUser || !selectedWorkoutId) return;

    try {
      const workout = workouts.find((w) => w.id === selectedWorkoutId);
      if (!workout) return;

      const newExercise: Exercise = {
        ...exercise,
        id: Date.now().toString(),
      };

      const updatedExercises = [...workout.exercises, newExercise];
      await updateWorkout(selectedWorkoutId, workout.name, updatedExercises);
      await loadWorkouts();
      await loadSchedule();
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  const handleScheduleChange = async (
    dayOfWeek: number,
    workoutId: string | null,
  ) => {
    if (!currentUser) return;

    try {
      if (workoutId) {
        await scheduleWorkout(currentUser.uid, workoutId, dayOfWeek);
      } else {
        // Remove from schedule by setting to null
        await scheduleWorkout(currentUser.uid, "", dayOfWeek);
      }
      await loadSchedule();
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleWorkoutExpansion = (workoutId: string) => {
    setExpandedWorkouts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(workoutId)) {
        newSet.delete(workoutId);
      } else {
        newSet.add(workoutId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Gym Tracker</h1>
                <p className="text-sm text-muted-foreground">
                  Olá, {currentUser?.displayName}
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="workouts" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="workouts">Meus Treinos</TabsTrigger>
            <TabsTrigger value="schedule">Agenda Semanal</TabsTrigger>
          </TabsList>

          {/* Workouts Tab */}
          <TabsContent value="workouts" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Meus Treinos</h2>
                <p className="text-muted-foreground">
                  Crie e gerencie suas rotinas de treino
                </p>
              </div>
              <Button onClick={() => setCreateWorkoutOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Treino
              </Button>
            </div>

            {workouts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Nenhum treino criado ainda. Clique em "Novo Treino" para
                  começar.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {workouts.map((workout) => (
                  <div key={workout.id}>
                    <WorkoutCard
                      workout={workout}
                      onDelete={handleDeleteWorkout}
                      onToggle={() => toggleWorkoutExpansion(workout.id)}
                      isExpanded={expandedWorkouts.has(workout.id)}
                    />
                    {expandedWorkouts.has(workout.id) && (
                      <div className="mt-2 pl-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedWorkoutId(workout.id);
                            setAddExerciseOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Exercício
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Agenda Semanal</h2>
              <p className="text-muted-foreground">
                Organize seus treinos ao longo da semana
              </p>
            </div>

            <WeeklySchedule
              workouts={workouts}
              schedule={schedule}
              onScheduleChange={handleScheduleChange}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <CreateWorkoutDialog
        open={createWorkoutOpen}
        onOpenChange={setCreateWorkoutOpen}
        onCreate={handleCreateWorkout}
      />

      <AddExerciseDialog
        open={addExerciseOpen}
        onOpenChange={setAddExerciseOpen}
        onAdd={handleAddExercise}
      />
    </div>
  );
};
