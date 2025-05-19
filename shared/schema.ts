import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Equipment list schema
export const equipmentLists = pgTable("equipment_lists", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  listTitle: text("list_title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  items: jsonb("items").notNull().$type<{ name: string; checked: boolean }[]>(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  uid: true,
  email: true,
  displayName: true,
});

export const insertEquipmentListSchema = createInsertSchema(equipmentLists).pick({
  userId: true,
  listTitle: true,
  items: true,
});

// Item schema for validation
export const equipmentItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  checked: z.boolean().default(false),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEquipmentList = z.infer<typeof insertEquipmentListSchema>;
export type EquipmentList = typeof equipmentLists.$inferSelect;
export type EquipmentItem = z.infer<typeof equipmentItemSchema>;
