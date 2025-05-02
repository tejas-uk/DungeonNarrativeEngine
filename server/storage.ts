import { WorldFormData, WorldOutput, savedWorlds, type User, type InsertUser, type SavedWorld, type InsertSavedWorld } from "@shared/schema";
import { users } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Worlds management
  getSavedWorlds(): Promise<SavedWorld[]>;
  getSavedWorld(id: number): Promise<SavedWorld | undefined>;
  createSavedWorld(world: { name: string, formData: WorldFormData, output?: WorldOutput }): Promise<SavedWorld>;
  deleteSavedWorld(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private savedWorlds: Map<number, SavedWorld>;
  userCurrentId: number;
  worldCurrentId: number;

  constructor() {
    this.users = new Map();
    this.savedWorlds = new Map();
    this.userCurrentId = 1;
    this.worldCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSavedWorlds(): Promise<SavedWorld[]> {
    return Array.from(this.savedWorlds.values());
  }

  async getSavedWorld(id: number): Promise<SavedWorld | undefined> {
    return this.savedWorlds.get(id);
  }

  async createSavedWorld(data: { name: string, formData: WorldFormData, output?: WorldOutput }): Promise<SavedWorld> {
    const id = this.worldCurrentId++;
    const createdAt = new Date().toISOString();
    
    const world: SavedWorld = {
      id,
      name: data.name,
      formData: data.formData,
      output: data.output || null,
      createdAt
    };
    
    this.savedWorlds.set(id, world);
    return world;
  }

  async deleteSavedWorld(id: number): Promise<boolean> {
    return this.savedWorlds.delete(id);
  }
}

export const storage = new MemStorage();
