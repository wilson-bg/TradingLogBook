import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Target, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            TradingLog Pro
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Tu diario de trading profesional para registrar, analizar y optimizar tus operaciones
          </p>
          <Button 
            onClick={() => window.location.href = "/api/login"}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Iniciar Sesión
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="w-12 h-12 mx-auto text-blue-600 mb-2" />
              <CardTitle className="text-slate-900 dark:text-white">
                Seguimiento de Operaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                Registra todas tus operaciones con detalles completos y calcula automáticamente tus P&L
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="w-12 h-12 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-slate-900 dark:text-white">
                Estadísticas Avanzadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                Analiza tu rendimiento con gráficos y métricas detalladas
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="w-12 h-12 mx-auto text-purple-600 mb-2" />
              <CardTitle className="text-slate-900 dark:text-white">
                Planes de Trading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                Crea y gestiona tus planes de trading con objetivos claros
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 mx-auto text-red-600 mb-2" />
              <CardTitle className="text-slate-900 dark:text-white">
                Gestión de Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                Controla tu riesgo con herramientas de análisis y alertas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
            ¿Por qué TradingLog Pro?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Mejora tu Disciplina
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Mantén un registro detallado de todas tus operaciones para identificar patrones y mejorar tu estrategia
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Análisis Profesional
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Utiliza herramientas de análisis avanzadas para evaluar tu rendimiento y tomar decisiones informadas
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Fácil de Usar
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Interfaz intuitiva y diseño responsivo que funciona en cualquier dispositivo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}