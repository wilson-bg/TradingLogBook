import { pgTable, text, serial, decimal, timestamp, boolean, varchar, jsonb, index } from "drizzle-orm/pg-core";
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

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  pnl: true,
});

export const insertTradingPlanSchema = createInsertSchema(tradingPlans).omit({
  id: true,
  createdAt: true,
});

export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof trades.$inferSelect;
export type InsertTradingPlan = z.infer<typeof insertTradingPlanSchema>;
export type TradingPlan = typeof tradingPlans.$inferSelect;

// User types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
