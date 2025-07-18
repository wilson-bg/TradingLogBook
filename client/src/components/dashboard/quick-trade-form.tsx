import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function QuickTradeForm() {
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
      setFormData({
        instrument: "",
        type: "buy",
        entryPrice: "",
        exitPrice: "",
        size: "",
        notes: "",
      });
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
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "USD/CHF",
    "AUD/USD",
    "USD/CAD",
    "NZD/USD",
    "BTC/USD",
    "ETH/USD",
    "SPX500",
    "NASDAQ",
    "DOW30",
  ];

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Registro Rápido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="instrument">Instrumento</Label>
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
            <Label>Tipo</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={formData.type === "buy" ? "default" : "outline"}
                className={formData.type === "buy" ? "bg-green-600 hover:bg-green-700" : ""}
                onClick={() => setFormData({...formData, type: "buy"})}
              >
                Compra
              </Button>
              <Button
                type="button"
                variant={formData.type === "sell" ? "default" : "outline"}
                className={formData.type === "sell" ? "bg-red-600 hover:bg-red-700" : ""}
                onClick={() => setFormData({...formData, type: "sell"})}
              >
                Venta
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="entryPrice">Entrada</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.0001"
                placeholder="1.0950"
                value={formData.entryPrice}
                onChange={(e) => setFormData({...formData, entryPrice: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="exitPrice">Salida</Label>
              <Input
                id="exitPrice"
                type="number"
                step="0.0001"
                placeholder="1.0980"
                value={formData.exitPrice}
                onChange={(e) => setFormData({...formData, exitPrice: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="size">Tamaño</Label>
            <Input
              id="size"
              type="number"
              step="0.01"
              placeholder="0.10"
              value={formData.size}
              onChange={(e) => setFormData({...formData, size: e.target.value})}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90" 
            disabled={createTradeMutation.isPending}
          >
            {createTradeMutation.isPending ? "Registrando..." : "Registrar Operación"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
