import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Eye } from "lucide-react";
import { Trade } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function History() {
  const { data: trades, isLoading } = useQuery({
    queryKey: ["/api/trades"],
  });

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("es-ES"),
      time: date.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  const formatPnL = (pnl: string | null) => {
    if (!pnl) return "Pendiente";
    const value = parseFloat(pnl);
    const sign = value >= 0 ? "+" : "";
    return `${sign}$${value.toFixed(2)}`;
  };

  const getPnLColor = (pnl: string | null) => {
    if (!pnl) return "text-gray-500";
    const value = parseFloat(pnl);
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getStatusBadge = (status: string) => {
    return status === "open" ? (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        Abierta
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
        Cerrada
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Historial de Operaciones
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Input type="date" className="w-auto" />
                <span className="text-sm text-gray-500">a</span>
                <Input type="date" className="w-auto" />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todos los instrumentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los instrumentos</SelectItem>
                  <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                  <SelectItem value="GBP/USD">GBP/USD</SelectItem>
                  <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="open">Abiertas</SelectItem>
                  <SelectItem value="closed">Cerradas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                    Fecha/Hora
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                    Instrumento
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                    Entrada
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                    Salida
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                    Tamaño
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                    P&L
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {!trades || trades.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center space-y-2">
                        <Eye className="h-12 w-12 text-gray-300" />
                        <p>No hay operaciones registradas</p>
                        <p className="text-sm">Comienza registrando tu primera operación</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  trades.map((trade: Trade) => {
                    const { date, time } = formatDate(trade.entryTime);
                    return (
                      <tr key={trade.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-sm">{date}</div>
                            <div className="text-xs text-gray-500">{time}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-sm">{trade.instrument}</td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant={trade.type === "buy" ? "default" : "destructive"}
                            className={trade.type === "buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          >
                            {trade.type === "buy" ? "Compra" : "Venta"}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(trade.status)}</td>
                        <td className="py-4 px-4 font-mono text-sm">{trade.entryPrice}</td>
                        <td className="py-4 px-4 font-mono text-sm">{trade.exitPrice || "-"}</td>
                        <td className="py-4 px-4 font-mono text-sm">{trade.size}</td>
                        <td className={`py-4 px-4 font-medium text-sm ${getPnLColor(trade.pnl)}`}>
                          {formatPnL(trade.pnl)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/70">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {trades && trades.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">{trades.length}</span> de <span className="font-medium">{trades.length}</span> operaciones
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="default" size="sm" className="bg-primary">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
