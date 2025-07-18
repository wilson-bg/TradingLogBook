import { useQuery } from "@tanstack/react-query";
import MetricsCards from "@/components/dashboard/metrics-cards";
import CapitalChart from "@/components/dashboard/capital-chart";
import QuickTradeForm from "@/components/dashboard/quick-trade-form";
import RecentTradesTable from "@/components/dashboard/recent-trades-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: trades, isLoading: tradesLoading } = useQuery({
    queryKey: ["/api/trades"],
  });

  if (statsLoading || tradesLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-80 rounded-xl" />
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <MetricsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CapitalChart />
        </div>
        <QuickTradeForm />
      </div>

      <div className="mt-8">
        <RecentTradesTable trades={trades?.slice(0, 10) || []} />
      </div>
    </div>
  );
}
