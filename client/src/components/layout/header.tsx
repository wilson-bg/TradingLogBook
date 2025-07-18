import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, User } from "lucide-react";

const pageNames: Record<string, string> = {
  "/": "Dashboard",
  "/new-trade": "Nueva Operación",
  "/history": "Historial",
  "/trading-plans": "Planes de Trading",
  "/statistics": "Estadísticas",
};

const pageDescriptions: Record<string, string> = {
  "/": "Resumen de tu actividad de trading",
  "/new-trade": "Registrar una nueva operación",
  "/history": "Historial completo de operaciones",
  "/trading-plans": "Gestión de planes de trading",
  "/statistics": "Análisis detallado de rendimiento",
};

export default function Header() {
  const [location] = useLocation();
  const pageName = pageNames[location] || "Página";
  const pageDescription = pageDescriptions[location] || "";

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{pageName}</h2>
            {pageDescription && (
              <p className="text-sm text-gray-600">{pageDescription}</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/new-trade">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Operación
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Trader Pro</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
