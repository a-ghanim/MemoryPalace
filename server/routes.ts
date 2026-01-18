import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemoryPalaceSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/palaces", async (req, res) => {
    try {
      const palaces = await storage.getAllPalaces();
      res.json(palaces);
    } catch (error) {
      console.error("Error fetching palaces:", error);
      res.status(500).json({ error: "Failed to fetch palaces" });
    }
  });

  app.get("/api/palaces/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid palace ID" });
      }
      const palace = await storage.getPalace(id);
      if (!palace) {
        return res.status(404).json({ error: "Palace not found" });
      }
      res.json(palace);
    } catch (error) {
      console.error("Error fetching palace:", error);
      res.status(500).json({ error: "Failed to fetch palace" });
    }
  });

  app.post("/api/palaces", async (req, res) => {
    try {
      const parsed = insertMemoryPalaceSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid palace data", details: parsed.error.errors });
      }
      const palace = await storage.createPalace(parsed.data);
      res.status(201).json(palace);
    } catch (error) {
      console.error("Error creating palace:", error);
      res.status(500).json({ error: "Failed to create palace" });
    }
  });

  app.put("/api/palaces/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid palace ID" });
      }
      
      const parsed = insertMemoryPalaceSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid palace data", details: parsed.error.errors });
      }
      
      const palace = await storage.updatePalace(id, parsed.data);
      if (!palace) {
        return res.status(404).json({ error: "Palace not found" });
      }
      res.json(palace);
    } catch (error) {
      console.error("Error updating palace:", error);
      res.status(500).json({ error: "Failed to update palace" });
    }
  });

  app.delete("/api/palaces/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid palace ID" });
      }
      const deleted = await storage.deletePalace(id);
      if (!deleted) {
        return res.status(404).json({ error: "Palace not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting palace:", error);
      res.status(500).json({ error: "Failed to delete palace" });
    }
  });

  return httpServer;
}
