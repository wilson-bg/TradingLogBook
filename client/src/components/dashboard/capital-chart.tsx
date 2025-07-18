import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Ene', capital: 40000 },
  { month: 'Feb', capital: 41200 },
  { month: 'Mar', capital: 39800 },
  { month: 'Abr', capital: 42100 },
  { month: 'May', capital: 43500 },
  { month: 'Jun', capital: 44800 },
  { month: 'Jul', capital: 46200 },
  { month: 'Ago', capital: 47100 },
  { month: 'Sep', capital: 48900 },
  { month: 'Oct', capital: 50200 },
  { month: 'Nov', capital: 51800 },
  { month: 'Dic', capital: 52450 },
];

export default function CapitalChart() {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Evolución del Capital
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="default" size="sm" className="bg-primary text-white">
              1M
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              3M
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              1A
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, 'Capital']}
              />
              <Line 
                type="monotone" 
                dataKey="capital" 
                stroke="hsl(207, 90%, 54%)" 
                strokeWidth={2}
                dot={{ fill: 'hsl(207, 90%, 54%)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
