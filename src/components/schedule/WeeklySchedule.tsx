import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Workout } from '@/types';
import { Calendar } from 'lucide-react';

interface WeeklyScheduleProps {
  workouts: Workout[];
  schedule: { [key: number]: Workout | null };
  onScheduleChange: (dayOfWeek: number, workoutId: string | null) => void;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
];

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  workouts,
  schedule,
  onScheduleChange,
}) => {
  return (
    <div className="space-y-4">
      {DAYS_OF_WEEK.map((day) => {
        const scheduledWorkout = schedule[day.value];
        
        return (
          <Card key={day.value}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {day.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={scheduledWorkout?.id || 'rest'}
                onValueChange={(value) => {
                  onScheduleChange(day.value, value === 'rest' ? null : value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um treino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rest">Descanso</SelectItem>
                  {workouts.map((workout) => (
                    <SelectItem key={workout.id} value={workout.id}>
                      {workout.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {scheduledWorkout && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Exercícios:
                  </p>
                  {scheduledWorkout.exercises.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum exercício adicionado ainda
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {scheduledWorkout.exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="text-sm p-2 bg-muted/50 rounded"
                        >
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {exercise.sets}x{exercise.reps} • {exercise.weight}kg
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
