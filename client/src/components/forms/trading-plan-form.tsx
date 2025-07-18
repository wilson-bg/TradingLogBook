import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TradingPlanFormProps {
  onSuccess?: () => void;
}

export default function TradingPlanForm({ onSuccess }: TradingPlanFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    objectives: "",
    strategy: "",
    riskPercentage: "",
    targetReturn: "",
    isActive: true,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPlanMutation = useMutation({
    mutationFn: async (planData: any) => {
      const response = await apiRequest("POST", "/api/trading-plans", planData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-plans"] });
      toast({
        title: "Plan creado",
        description: "El plan de trading se ha creado exitosamente",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el plan de trading",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del plan es requerido",
        variant: "destructive",
      });
      return;
    }
    createPlanMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Nombre del Plan *</Label>
        <Input
          id="name"
          placeholder="Ej: Estrategia Scalping EUR/USD"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          placeholder="Describe el objetivo general de este plan..."
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="h-20"
        />
      </div>

      <div>
        <Label htmlFor="objectives">Objetivos Específicos</Label>
        <Textarea
          id="objectives"
          placeholder="Lista los objetivos específicos que quieres alcanzar..."
          value={formData.objectives}
          onChange={(e) => setFormData({...formData, objectives: e.target.value})}
          className="h-24"
        />
      </div>

      <div>
        <Label htmlFor="strategy">Estrategia</Label>
        <Textarea
          id="strategy"
          placeholder="Describe la estrategia que utilizarás..."
          value={formData.strategy}
          onChange={(e) => setFormData({...formData, strategy: e.target.value})}
          className="h-24"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="riskPercentage">Porcentaje de Riesgo (%)</Label>
          <Input
            id="riskPercentage"
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="2.0"
            value={formData.riskPercentage}
            onChange={(e) => setFormData({...formData, riskPercentage: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="targetReturn">Objetivo de Retorno ($)</Label>
          <Input
            id="targetReturn"
            type="number"
            step="0.01"
            min="0"
            placeholder="5000"
            value={formData.targetReturn}
            onChange={(e) => setFormData({...formData, targetReturn: e.target.value})}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
        />
        <Label htmlFor="isActive">Plan activo</Label>
      </div>

      <div className="flex space-x-4">
        <Button 
          type="submit" 
          className="flex-1 bg-primary hover:bg-primary/90" 
          disabled={createPlanMutation.isPending}
        >
          {createPlanMutation.isPending ? "Creando..." : "Crear Plan"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onSuccess?.()}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
