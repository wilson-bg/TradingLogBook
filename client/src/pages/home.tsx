import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { TrendingUp, BarChart3, Target, LogOut } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Bienvenido, {user?.firstName || user?.email || "Trader"}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Gestiona tu trading de manera profesional
            </p>
          </div>
          <Button
            onClick={() => window.location.href = "/api/logout"}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                <CardTitle className="text-slate-900 dark:text-white">
                  Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300 text-center">
                  Ver resumen de tu rendimiento y estadísticas principales
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/new-trade">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-green-600 mb-2" />
                <CardTitle className="text-slate-900 dark:text-white">
                  Nueva Operación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300 text-center">
                  Registra una nueva operación de trading
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/trading-plans">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="text-center">
                <Target className="w-12 h-12 mx-auto text-purple-600 mb-2" />
                <CardTitle className="text-slate-900 dark:text-white">
                  Planes de Trading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300 text-center">
                  Crea y gestiona tus estrategias de trading
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/history">
                <Button variant="outline" className="w-full">
                  Ver Historial
                </Button>
              </Link>
              <Link href="/statistics">
                <Button variant="outline" className="w-full">
                  Estadísticas
                </Button>
              </Link>
              <Link href="/new-trade">
                <Button className="w-full">
                  Registrar Operación
                </Button>
              </Link>
              <Link href="/trading-plans">
                <Button variant="outline" className="w-full">
                  Mis Planes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}