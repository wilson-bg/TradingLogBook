import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function TradeForm() {
  const [formData, setFormData] = useState({
    instrument: "",
    type: "buy",
    entryPrice: "",
    exitPrice: "",
    size: "",
    notes: "",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const createTradeMutation = useMutation({
    mutationFn: async (tradeData: any) => {
      const response = await apiRequest("POST", "/api/trades", {
        ...tradeData,
        entryTime: new Date().toISOString(),
        exitTime: tradeData.exitPrice ? new Date().toISOString() : null,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trades"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Operación registrada",
        description: "La operación se ha registrado exitosamente",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo registrar la operación",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.instrument || !formData.entryPrice || !formData.size) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }
    createTradeMutation.mutate(formData);
  };

  const instruments = [
    "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD",
    "BTC/USD", "ETH/USD", "LTC/USD", "XRP/USD", "ADA/USD",
    "SPX500", "NASDAQ", "DOW30", "DAX", "FTSE100", "CAC40",
    "XAUUSD", "XAGUSD", "XPTUSD", "XPDUSD",
    "USDJPY", "GBPJPY", "EURJPY", "AUDJPY", "CADJPY"
  ];

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Registrar Nueva Operación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="instrument">Instrumento *</Label>
              <Select value={formData.instrument} onValueChange={(value) => setFormData({...formData, instrument: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un instrumento" />
                </SelectTrigger>
                <SelectContent>
                  {instruments.map((instrument) => (
                    <SelectItem key={instrument} value={instrument}>
                      {instrument}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tipo de Operación *</Label>
              <div className="flex space-x-2 mt-2">
                <Button
                  type="button"
                  variant={formData.type === "buy" ? "default" : "outline"}
                  className={`flex-1 ${formData.type === "buy" ? "bg-green-600 hover:bg-green-700" : ""}`}
                  onClick={() => setFormData({...formData, type: "buy"})}
                >
                  Compra (Long)
                </Button>
                <Button
                  type="button"
                  variant={formData.type === "sell" ? "default" : "outline"}
                  className={`flex-1 ${formData.type === "sell" ? "bg-red-600 hover:bg-red-700" : ""}`}
                  onClick={() => setFormData({...formData, type: "sell"})}
                >
                  Venta (Short)
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="entryPrice">Precio de Entrada *</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.00001"
                placeholder="1.09500"
                value={formData.entryPrice}
                onChange={(e) => setFormData({...formData, entryPrice: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="exitPrice">Precio de Salida</Label>
              <Input
                id="exitPrice"
                type="number"
                step="0.00001"
                placeholder="1.09800"
                value={formData.exitPrice}
                onChange={(e) => setFormData({...formData, exitPrice: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">
                Opcional - Déjalo vacío para operaciones abiertas
              </p>
            </div>
            <div>
              <Label htmlFor="size">Tamaño de Posición *</Label>
              <Input
                id="size"
                type="number"
                step="0.01"
                placeholder="0.10"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              placeholder="Agrega notas sobre la operación, estrategia utilizada, razones para abrir/cerrar, etc."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="h-24"
            />
          </div>

          <div className="flex space-x-4">
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90" 
              disabled={createTradeMutation.isPending}
            >
              {createTradeMutation.isPending ? "Registrando..." : "Registrar Operación"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setLocation("/")}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
