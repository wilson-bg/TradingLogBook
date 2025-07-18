import { trades, tradingPlans, type Trade, type InsertTrade, type TradingPlan, type InsertTradingPlan } from "@shared/schema";

export interface IStorage {
  // Trade operations
  getTrades(): Promise<Trade[]>;
  getTrade(id: number): Promise<Trade | undefined>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  updateTrade(id: number, trade: Partial<Trade>): Promise<Trade | undefined>;
  deleteTrade(id: number): Promise<boolean>;
  
  // Trading plan operations
  getTradingPlans(): Promise<TradingPlan[]>;
  getTradingPlan(id: number): Promise<TradingPlan | undefined>;
  createTradingPlan(plan: InsertTradingPlan): Promise<TradingPlan>;
  updateTradingPlan(id: number, plan: Partial<TradingPlan>): Promise<TradingPlan | undefined>;
  deleteTradingPlan(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private trades: Map<number, Trade>;
  private tradingPlans: Map<number, TradingPlan>;
  private currentTradeId: number;
  private currentPlanId: number;

  constructor() {
    this.trades = new Map();
    this.tradingPlans = new Map();
    this.currentTradeId = 1;
    this.currentPlanId = 1;
  }

  // Trade operations
  async getTrades(): Promise<Trade[]> {
    return Array.from(this.trades.values()).sort((a, b) => 
      new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()
    );
  }

  async getTrade(id: number): Promise<Trade | undefined> {
    return this.trades.get(id);
  }

  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const id = this.currentTradeId++;
    
    // Calculate P&L if both entry and exit prices are provided
    let pnl = null;
    if (insertTrade.exitPrice && insertTrade.entryPrice) {
      const entryPrice = parseFloat(insertTrade.entryPrice);
      const exitPrice = parseFloat(insertTrade.exitPrice);
      const size = parseFloat(insertTrade.size);
      
      if (insertTrade.type === 'buy') {
        pnl = ((exitPrice - entryPrice) * size).toFixed(2);
      } else {
        pnl = ((entryPrice - exitPrice) * size).toFixed(2);
      }
    }

    const trade: Trade = {
      ...insertTrade,
      id,
      pnl,
      status: insertTrade.exitPrice ? 'closed' : 'open',
      exitPrice: insertTrade.exitPrice || null,
      exitTime: insertTrade.exitTime || null,
      notes: insertTrade.notes || null,
    };
    
    this.trades.set(id, trade);
    return trade;
  }

  async updateTrade(id: number, updates: Partial<Trade>): Promise<Trade | undefined> {
    const trade = this.trades.get(id);
    if (!trade) return undefined;

    const updatedTrade = { ...trade, ...updates };
    
    // Recalculate P&L if prices change
    if (updatedTrade.exitPrice && updatedTrade.entryPrice) {
      const entryPrice = parseFloat(updatedTrade.entryPrice);
      const exitPrice = parseFloat(updatedTrade.exitPrice);
      const size = parseFloat(updatedTrade.size);
      
      if (updatedTrade.type === 'buy') {
        updatedTrade.pnl = ((exitPrice - entryPrice) * size).toFixed(2);
      } else {
        updatedTrade.pnl = ((entryPrice - exitPrice) * size).toFixed(2);
      }
      updatedTrade.status = 'closed';
    }

    this.trades.set(id, updatedTrade);
    return updatedTrade;
  }

  async deleteTrade(id: number): Promise<boolean> {
    return this.trades.delete(id);
  }

  // Trading plan operations
  async getTradingPlans(): Promise<TradingPlan[]> {
    return Array.from(this.tradingPlans.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getTradingPlan(id: number): Promise<TradingPlan | undefined> {
    return this.tradingPlans.get(id);
  }

  async createTradingPlan(insertPlan: InsertTradingPlan): Promise<TradingPlan> {
    const id = this.currentPlanId++;
    const plan: TradingPlan = {
      ...insertPlan,
      id,
      createdAt: new Date(),
      description: insertPlan.description || null,
      objectives: insertPlan.objectives || null,
      strategy: insertPlan.strategy || null,
      riskPercentage: insertPlan.riskPercentage || null,
      targetReturn: insertPlan.targetReturn || null,
      isActive: insertPlan.isActive ?? true,
    };
    
    this.tradingPlans.set(id, plan);
    return plan;
  }

  async updateTradingPlan(id: number, updates: Partial<TradingPlan>): Promise<TradingPlan | undefined> {
    const plan = this.tradingPlans.get(id);
    if (!plan) return undefined;

    const updatedPlan = { ...plan, ...updates };
    this.tradingPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deleteTradingPlan(id: number): Promise<boolean> {
    return this.tradingPlans.delete(id);
  }
}

export const storage = new MemStorage();
