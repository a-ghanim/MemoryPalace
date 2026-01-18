import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const memoryPalaces = pgTable("memory_palaces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  template: text("template").notNull().default("mansion"),
  inputContent: text("input_content").notNull(),
  rooms: jsonb("rooms").notNull(),
  nodes: jsonb("nodes").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMemoryPalaceSchema = createInsertSchema(memoryPalaces).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMemoryPalace = z.infer<typeof insertMemoryPalaceSchema>;
export type MemoryPalace = typeof memoryPalaces.$inferSelect;
