import React from 'react';
import { Workout } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface WorkoutCardProps {
  workout: Workout;
  onDelete: (id: string) => void;
  onToggle: () => void;
  isExpanded: boolean;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onDelete,
  onToggle,
  isExpanded,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={onToggle}>
            <CardTitle className="text-lg">{workout.name}</CardTitle>
            <span className="text-sm text-muted-foreground">
              ({workout.exercises.length} exercício{workout.exercises.length !== 1 ? 's' : ''})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(workout.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {workout.exercises.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum exercício adicionado. Clique em "Adicionar Exercício" para começar.
              </p>
            ) : (
              workout.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{exercise.name}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{exercise.sets} séries</span>
                    <span>{exercise.reps} repetições</span>
                    <span>{exercise.weight}kg</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
