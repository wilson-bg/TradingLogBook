import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import NewTrade from "@/pages/new-trade";
import History from "@/pages/history";
import TradingPlans from "@/pages/trading-plans";
import Statistics from "@/pages/statistics";
import AppLayout from "@/components/layout/app-layout";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/new-trade" component={NewTrade} />
        <Route path="/history" component={History} />
        <Route path="/trading-plans" component={TradingPlans} />
        <Route path="/statistics" component={Statistics} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
