"use client";

import { useState } from "react";
import { Exercise } from "@/types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, Edit } from "lucide-react";

interface ExerciseListProps {
  exercises: Exercise[];
  onUpdate: (exercises: Exercise[]) => void;
}

export default function ExerciseList({ exercises, onUpdate }: ExerciseListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const handleAddExercise = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newExercise: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get("name") as string,
      sets: Number(formData.get("sets")),
      reps: Number(formData.get("reps")),
      weight: Number(formData.get("weight")),
    };

    onUpdate([...exercises, newExercise]);
    setIsAddDialogOpen(false);
    (e.target as HTMLFormElement).reset();
  };

  const handleEditExercise = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingExercise) return;

    const formData = new FormData(e.currentTarget);
    
    const updatedExercise: Exercise = {
      ...editingExercise,
      name: formData.get("name") as string,
      sets: Number(formData.get("sets")),
      reps: Number(formData.get("reps")),
      weight: Number(formData.get("weight")),
    };

    onUpdate(exercises.map(ex => ex.id === editingExercise.id ? updatedExercise : ex));
    setEditingExercise(null);
  };

  const handleDeleteExercise = (id: string) => {
    onUpdate(exercises.filter(ex => ex.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Exercícios</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Exercício
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Exercício</DialogTitle>
              <DialogDescription>
                Adicione um exercício à sua rotina de treino
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddExercise}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Exercício</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Ex: Supino reto"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sets">Séries</Label>
                    <Input
                      id="sets"
                      name="sets"
                      type="number"
                      min="1"
                      defaultValue="3"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reps">Repetições</Label>
                    <Input
                      id="reps"
                      name="reps"
                      type="number"
                      min="1"
                      defaultValue="12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      min="0"
                      step="0.5"
                      defaultValue="0"
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit">Adicionar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {exercises.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum exercício adicionado. Clique em "Adicionar Exercício" para começar.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {exercises.map((exercise) => (
            <Card key={exercise.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{exercise.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets} séries × {exercise.reps} repetições • {exercise.weight}kg
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingExercise(exercise)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteExercise(exercise.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de Edição */}
      <Dialog open={!!editingExercise} onOpenChange={() => setEditingExercise(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Exercício</DialogTitle>
            <DialogDescription>
              Atualize as informações do exercício
            </DialogDescription>
          </DialogHeader>
          {editingExercise && (
            <form onSubmit={handleEditExercise}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome do Exercício</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingExercise.name}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-sets">Séries</Label>
                    <Input
                      id="edit-sets"
                      name="sets"
                      type="number"
                      min="1"
                      defaultValue={editingExercise.sets}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-reps">Repetições</Label>
                    <Input
                      id="edit-reps"
                      name="reps"
                      type="number"
                      min="1"
                      defaultValue={editingExercise.reps}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-weight">Peso (kg)</Label>
                    <Input
                      id="edit-weight"
                      name="weight"
                      type="number"
                      min="0"
                      step="0.5"
                      defaultValue={editingExercise.weight}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}