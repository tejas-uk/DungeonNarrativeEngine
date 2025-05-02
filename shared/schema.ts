import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const savedWorlds = pgTable("saved_worlds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  formData: jsonb("form_data").notNull(),
  output: jsonb("output"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const worldFormSchema = z.object({
  // World Settings
  worldName: z.string(),
  regionsCount: z.number().min(1).max(10),
  climates: z.array(z.string()),
  terrains: z.array(z.string()),
  magicalPhenomena: z.array(z.string()),
  
  // Cultures and Politics
  civilizationsCount: z.number().min(0).max(10),
  civilizations: z.array(z.object({
    name: z.string(),
    dominantRaces: z.array(z.string()),
    government: z.string(),
    economy: z.string(),
    values: z.array(z.string())
  })),
  
  // Magic & Technology
  magicLevel: z.string(),
  techLevel: z.string(),
  powerSources: z.array(z.string()),
  
  // Historical Background
  worldAge: z.string(),
  worldChangingEvents: z.number().min(0).max(10),
  originMyths: z.string(),
  
  // Factions and Organizations
  factionsCount: z.number().min(0).max(10),
  factions: z.array(z.object({
    name: z.string(),
    type: z.string(),
    description: z.string(),
    relationships: z.string()
  })),
  
  // Narrative Flavor
  genre: z.string(),
  moralTone: z.string(),
  themes: z.array(z.string()),
  deadliness: z.string(),
  
  // Party & Characters
  playerCount: z.number().min(1).max(10),
  startingLevelRange: z.string(),
  allowedClasses: z.array(z.string()),
  characters: z.array(z.object({
    name: z.string(),
    race: z.string(),
    class: z.string(),
    background: z.string(),
    personalityTraits: z.string(),
    ideals: z.string(),
    bonds: z.string(),
    flaws: z.string()
  })),
  partyRelationships: z.string(),
  
  // Miscellaneous Options
  namingConvention: z.string(),
  measurementSystem: z.string(),
  customSeed: z.string().optional(),
});

export const worldOutputSchema = z.object({
  world: z.string(),
  npcs: z.string(),
  plot: z.string(),
  encounters: z.string(),
  dmScript: z.string().optional(),
  playerSheets: z.string().optional()
});

export const insertSavedWorldSchema = createInsertSchema(savedWorlds);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type WorldFormData = z.infer<typeof worldFormSchema>;
export type WorldOutput = z.infer<typeof worldOutputSchema>;
export type InsertSavedWorld = z.infer<typeof insertSavedWorldSchema>;
export type SavedWorld = typeof savedWorlds.$inferSelect;
