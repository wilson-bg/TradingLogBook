import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Trophy, DollarSign, Wallet } from "lucide-react";

interface MetricsCardsProps {
  stats: {
    totalTrades: number;
    winRate: number;
    totalPnL: number;
    currentCapital: number;
  };
}

export default function MetricsCards({ stats }: MetricsCardsProps) {
  const metrics = [
    {
      title: "Total Operaciones",
      value: stats?.totalTrades || 0,
      icon: TrendingUp,
      color: "bg-blue-100 text-primary",
      change: "+12% desde el mes pasado",
      changeColor: "text-green-600"
    },
    {
      title: "Win Rate",
      value: `${stats?.winRate || 0}%`,
      icon: Trophy,
      color: "bg-green-100 text-green-600",
      change: "+3.2% desde el mes pasado",
      changeColor: "text-green-600"
    },
    {
      title: "P&L Acumulado",
      value: `$${stats?.totalPnL?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
      change: "+8.7% desde el mes pasado",
      changeColor: "text-green-600"
    },
    {
      title: "Capital Actual",
      value: `$${stats?.currentCapital?.toLocaleString() || 0}`,
      icon: Wallet,
      color: "bg-blue-100 text-primary",
      change: "+5.3% desde el mes pasado",
      changeColor: "text-green-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm ${metric.changeColor}`}>{metric.change}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
