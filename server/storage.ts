import { users, memoryPalaces, type User, type InsertUser, type MemoryPalace, type InsertMemoryPalace } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllPalaces(userId?: number): Promise<MemoryPalace[]>;
  getPalace(id: number): Promise<MemoryPalace | undefined>;
  createPalace(palace: InsertMemoryPalace): Promise<MemoryPalace>;
  updatePalace(id: number, palace: Partial<InsertMemoryPalace>): Promise<MemoryPalace | undefined>;
  deletePalace(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllPalaces(userId?: number): Promise<MemoryPalace[]> {
    if (userId) {
      return db.select().from(memoryPalaces)
        .where(eq(memoryPalaces.userId, userId))
        .orderBy(desc(memoryPalaces.updatedAt));
    }
    return db.select().from(memoryPalaces).orderBy(desc(memoryPalaces.updatedAt));
  }

  async getPalace(id: number): Promise<MemoryPalace | undefined> {
    const [palace] = await db.select().from(memoryPalaces).where(eq(memoryPalaces.id, id));
    return palace;
  }

  async createPalace(palace: InsertMemoryPalace): Promise<MemoryPalace> {
    const [newPalace] = await db.insert(memoryPalaces).values(palace).returning();
    return newPalace;
  }

  async updatePalace(id: number, palace: Partial<InsertMemoryPalace>): Promise<MemoryPalace | undefined> {
    const [updated] = await db
      .update(memoryPalaces)
      .set({ ...palace, updatedAt: new Date() })
      .where(eq(memoryPalaces.id, id))
      .returning();
    return updated;
  }

  async deletePalace(id: number): Promise<boolean> {
    const result = await db.delete(memoryPalaces).where(eq(memoryPalaces.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
