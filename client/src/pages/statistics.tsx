import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Statistics() {
  const { data: trades, isLoading: tradesLoading } = useQuery({
    queryKey: ["/api/trades"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (tradesLoading || statsLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const closedTrades = trades?.filter(t => t.status === 'closed') || [];
  const openTrades = trades?.filter(t => t.status === 'open') || [];
  const winningTrades = closedTrades.filter(t => parseFloat(t.pnl || '0') > 0);
  const losingTrades = closedTrades.filter(t => parseFloat(t.pnl || '0') < 0);

  // Prepare data for charts
  const instrumentData = trades?.reduce((acc, trade) => {
    const existing = acc.find(item => item.instrument === trade.instrument);
    if (existing) {
      existing.count += 1;
      existing.pnl += parseFloat(trade.pnl || '0');
    } else {
      acc.push({
        instrument: trade.instrument,
        count: 1,
        pnl: parseFloat(trade.pnl || '0')
      });
    }
    return acc;
  }, [] as any[]) || [];

  const pieData = [
    { name: 'Ganadas', value: winningTrades.length, color: '#10B981' },
    { name: 'Perdidas', value: losingTrades.length, color: '#EF4444' },
    { name: 'Abiertas', value: openTrades.length, color: '#3B82F6' },
  ];

  const totalPnL = closedTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || '0'), 0);
  const avgWin = winningTrades.length > 0 ? 
    winningTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || '0'), 0) / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? 
    Math.abs(losingTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl || '0'), 0)) / losingTrades.length : 0;

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Operaciones Ganadoras</p>
                <p className="text-2xl font-bold text-green-600">{winningTrades.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                {closedTrades.length > 0 ? `${((winningTrades.length / closedTrades.length) * 100).toFixed(1)}%` : '0%'} del total
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Operaciones Perdedoras</p>
                <p className="text-2xl font-bold text-red-600">{losingTrades.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                {closedTrades.length > 0 ? `${((losingTrades.length / closedTrades.length) * 100).toFixed(1)}%` : '0%'} del total
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ganancia Promedio</p>
                <p className="text-2xl font-bold text-green-600">${avgWin.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">Por operación ganadora</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pérdida Promedio</p>
                <p className="text-2xl font-bold text-red-600">${avgLoss.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">Por operación perdedora</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Distribución de Operaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>P&L por Instrumento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={instrumentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="instrument" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'P&L']} />
                  <Bar dataKey="pnl" fill="hsl(207, 90%, 54%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Operaciones por Instrumento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {instrumentData.slice(0, 5).map((item, index) => (
                <div key={item.instrument} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{index + 1}</span>
                    </div>
                    <span className="font-medium">{item.instrument}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{item.count} operaciones</div>
                    <div className={`text-sm ${item.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.pnl >= 0 ? '+' : ''}${item.pnl.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Métricas Avanzadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Factor de Beneficio</span>
                <Badge variant="outline">
                  {avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : 'N/A'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Mejor Operación</span>
                <Badge variant="outline" className="text-green-600">
                  ${Math.max(...closedTrades.map(t => parseFloat(t.pnl || '0')), 0).toFixed(2)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Peor Operación</span>
                <Badge variant="outline" className="text-red-600">
                  ${Math.min(...closedTrades.map(t => parseFloat(t.pnl || '0')), 0).toFixed(2)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Operaciones Abiertas</span>
                <Badge variant="outline">
                  {openTrades.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total P&L</span>
                <Badge variant="outline" className={totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
