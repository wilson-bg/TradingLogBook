import { pgTable, text, serial, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  instrument: text("instrument").notNull(),
  type: text("type").notNull(), // 'buy' or 'sell'
  entryPrice: decimal("entry_price", { precision: 10, scale: 5 }).notNull(),
  exitPrice: decimal("exit_price", { precision: 10, scale: 5 }),
  size: decimal("size", { precision: 10, scale: 4 }).notNull(),
  pnl: decimal("pnl", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("open"), // 'open', 'closed'
  entryTime: timestamp("entry_time").notNull(),
  exitTime: timestamp("exit_time"),
  notes: text("notes"),
});

export const tradingPlans = pgTable("trading_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  objectives: text("objectives"),
  strategy: text("strategy"),
  riskPercentage: decimal("risk_percentage", { precision: 5, scale: 2 }),
  targetReturn: decimal("target_return", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  pnl: true,
  createdAt: true,
});

export const insertTradingPlanSchema = createInsertSchema(tradingPlans).omit({
  id: true,
  createdAt: true,
});

export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof trades.$inferSelect;
export type InsertTradingPlan = z.infer<typeof insertTradingPlanSchema>;
export type TradingPlan = typeof tradingPlans.$inferSelect;
