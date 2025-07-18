import { Link, useLocation } from "wouter";
import { BarChart3, Plus, History, FileText, BarChart2, PieChart, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3, section: "Principal" },
  { name: "Nueva Operación", href: "/new-trade", icon: Plus, section: "Principal" },
  { name: "Historial", href: "/history", icon: History, section: "Principal" },
  { name: "Planes de Trading", href: "/trading-plans", icon: FileText, section: "Principal" },
  { name: "Estadísticas", href: "/statistics", icon: BarChart2, section: "Análisis" },
];

export default function Sidebar() {
  const [location] = useLocation();

  const principalItems = navigation.filter(item => item.section === "Principal");
  const analysisItems = navigation.filter(item => item.section === "Análisis");

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TradingLog</h1>
            <p className="text-sm text-gray-500">Pro</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-6 py-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Principal</p>
        </div>
        {principalItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex items-center px-6 py-3 text-sm font-medium transition-colors cursor-pointer",
                isActive 
                  ? "text-primary bg-blue-50 border-r-2 border-primary" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}>
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </div>
            </Link>
          );
        })}
        
        <div className="px-6 py-3 mt-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Análisis</p>
        </div>
        {analysisItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex items-center px-6 py-3 text-sm font-medium transition-colors cursor-pointer",
                isActive 
                  ? "text-primary bg-blue-50 border-r-2 border-primary" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}>
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
