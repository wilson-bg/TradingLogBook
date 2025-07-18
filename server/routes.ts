import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTradeSchema, insertTradingPlanSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Trade routes
  app.get("/api/trades", async (req, res) => {
    try {
      const trades = await storage.getTrades();
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trades" });
    }
  });

  app.get("/api/trades/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trade = await storage.getTrade(id);
      if (!trade) {
        return res.status(404).json({ message: "Trade not found" });
      }
      res.json(trade);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trade" });
    }
  });

  app.post("/api/trades", async (req, res) => {
    try {
      const tradeData = insertTradeSchema.parse(req.body);
      const trade = await storage.createTrade(tradeData);
      res.status(201).json(trade);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trade data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create trade" });
    }
  });

  app.put("/api/trades/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const trade = await storage.updateTrade(id, updates);
      if (!trade) {
        return res.status(404).json({ message: "Trade not found" });
      }
      res.json(trade);
    } catch (error) {
      res.status(500).json({ message: "Failed to update trade" });
    }
  });

  app.delete("/api/trades/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTrade(id);
      if (!success) {
        return res.status(404).json({ message: "Trade not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trade" });
    }
  });

  // Trading plan routes
  app.get("/api/trading-plans", async (req, res) => {
    try {
      const plans = await storage.getTradingPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trading plans" });
    }
  });

  app.get("/api/trading-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getTradingPlan(id);
      if (!plan) {
        return res.status(404).json({ message: "Trading plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trading plan" });
    }
  });

  app.post("/api/trading-plans", async (req, res) => {
    try {
      const planData = insertTradingPlanSchema.parse(req.body);
      const plan = await storage.createTradingPlan(planData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid plan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create trading plan" });
    }
  });

  app.put("/api/trading-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const plan = await storage.updateTradingPlan(id, updates);
      if (!plan) {
        return res.status(404).json({ message: "Trading plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to update trading plan" });
    }
  });

  app.delete("/api/trading-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTradingPlan(id);
      if (!success) {
        return res.status(404).json({ message: "Trading plan not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trading plan" });
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const trades = await storage.getTrades();
      const closedTrades = trades.filter(t => t.status === 'closed');
      
      const totalTrades = trades.length;
      const winningTrades = closedTrades.filter(t => parseFloat(t.pnl || '0') > 0).length;
      const winRate = closedTrades.length > 0 ? (winningTrades / closedTrades.length * 100).toFixed(1) : '0.0';
      const totalPnL = closedTrades.reduce((sum, t) => sum + parseFloat(t.pnl || '0'), 0).toFixed(2);
      
      // Mock current capital - in a real app this would come from account data
      const currentCapital = (50000 + parseFloat(totalPnL)).toFixed(2);
      
      res.json({
        totalTrades,
        winRate: parseFloat(winRate),
        totalPnL: parseFloat(totalPnL),
        currentCapital: parseFloat(currentCapital)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
