import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Target, TrendingUp, Eye } from "lucide-react";
import { TradingPlan } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import TradingPlanForm from "@/components/forms/trading-plan-form";
import TradingPlanDetail from "@/components/trading-plan/trading-plan-detail";
import TradingPlanEdit from "@/components/trading-plan/trading-plan-edit";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TradingPlans() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TradingPlan | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'edit'>('list');
  
  const { data: plans, isLoading } = useQuery({
    queryKey: ["/api/trading-plans"],
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deletePlanMutation = useMutation({
    mutationFn: async (planId: number) => {
      const response = await apiRequest("DELETE", `/api/trading-plans/${planId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-plans"] });
      toast({
        title: "Plan eliminado",
        description: "El plan de trading se ha eliminado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el plan de trading",
        variant: "destructive",
      });
    },
  });

  const handleViewDetail = (plan: TradingPlan) => {
    setSelectedPlan(plan);
    setViewMode('detail');
  };

  const handleEdit = (plan: TradingPlan) => {
    setSelectedPlan(plan);
    setViewMode('edit');
  };

  const handleDelete = (planId: number) => {
    deletePlanMutation.mutate(planId);
  };

  const handleBackToList = () => {
    setSelectedPlan(null);
    setViewMode('list');
  };

  const handleEditSuccess = () => {
    setSelectedPlan(null);
    setViewMode('list');
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Show detail view
  if (viewMode === 'detail' && selectedPlan) {
    return (
      <div className="p-6">
        <TradingPlanDetail
          plan={selectedPlan}
          onEdit={() => setViewMode('edit')}
          onClose={handleBackToList}
        />
      </div>
    );
  }

  // Show edit view
  if (viewMode === 'edit' && selectedPlan) {
    return (
      <div className="p-6">
        <TradingPlanEdit
          plan={selectedPlan}
          onSuccess={handleEditSuccess}
          onCancel={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Planes de Trading</h2>
          <p className="text-gray-600">Gestiona tus estrategias y objetivos</p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Plan de Trading</DialogTitle>
            </DialogHeader>
            <TradingPlanForm onSuccess={() => setShowCreateForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {!plans || plans.length === 0 ? (
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="py-12">
            <div className="text-center">
              <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay planes de trading</h3>
              <p className="text-gray-600 mb-4">
                Crea tu primer plan para establecer objetivos y estrategias claras
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan: TradingPlan) => (
            <Card key={plan.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {plan.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {plan.description}
                    </p>
                  </div>
                  <Badge 
                    variant={plan.isActive ? "default" : "secondary"}
                    className={plan.isActive ? "bg-green-100 text-green-800" : ""}
                  >
                    {plan.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {plan.targetReturn && (
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600">
                        Objetivo: <span className="font-medium text-green-600">
                          ${parseFloat(plan.targetReturn).toLocaleString()}
                        </span>
                      </span>
                    </div>
                  )}
                  
                  {plan.riskPercentage && (
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-gray-600">
                        Riesgo: <span className="font-medium text-red-600">
                          {plan.riskPercentage}%
                        </span>
                      </span>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Creado: {formatDate(plan.createdAt!)}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-primary hover:text-primary/70"
                      onClick={() => handleEdit(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar plan?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El plan "{plan.name}" será eliminado permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(plan.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetail(plan)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalle
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
