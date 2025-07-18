import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TradingPlan } from "@shared/schema";
import { Target, TrendingUp, Calendar, FileText, Edit } from "lucide-react";

interface TradingPlanDetailProps {
  plan: TradingPlan;
  onEdit: () => void;
  onClose: () => void;
}

export default function TradingPlanDetail({ plan, onEdit, onClose }: TradingPlanDetailProps) {
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
          <Badge 
            variant={plan.isActive ? "default" : "secondary"}
            className={plan.isActive ? "bg-green-100 text-green-800 mt-2" : "mt-2"}
          >
            {plan.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button onClick={onEdit} className="bg-primary hover:bg-primary/90">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FileText className="h-5 w-5 mr-2" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
              <p className="text-gray-600">
                {plan.description || "No hay descripción disponible"}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Creado: {formatDate(plan.createdAt!)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Target className="h-5 w-5 mr-2" />
              Objetivos y Metas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan.targetReturn && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Objetivo de Retorno</span>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">
                    ${parseFloat(plan.targetReturn).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            
            {plan.riskPercentage && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Riesgo por Operación</span>
                <span className="font-medium text-red-600">
                  {plan.riskPercentage}%
                </span>
              </div>
            )}
            
            {(!plan.targetReturn && !plan.riskPercentage) && (
              <p className="text-gray-500 text-sm">
                No se han definido objetivos específicos
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {plan.objectives && (
        <Card>
          <CardHeader>
            <CardTitle>Objetivos Específicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-gray-700">
              {plan.objectives}
            </div>
          </CardContent>
        </Card>
      )}

      {plan.strategy && (
        <Card>
          <CardHeader>
            <CardTitle>Estrategia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-gray-700">
              {plan.strategy}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}