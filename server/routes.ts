import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemoryPalaceSchema } from "@shared/schema";
import { parseContentWithClaude } from "./claudeParsing";
import { requireAuth } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/parse-content", async (req, res) => {
    try {
      const { content } = req.body;
      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Content is required" });
      }

      const parsed = await parseContentWithClaude(content);
      res.json(parsed);
    } catch (error: any) {
      console.error("Error parsing content:", error);
      if (error.message === "ANTHROPIC_API_KEY not configured") {
        return res.status(503).json({ error: "AI service not configured", fallback: true });
      }
      res.status(500).json({ error: "Failed to parse content", fallback: true });
    }
  });

  app.get("/api/palaces", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const palaces = await storage.getAllPalaces(userId);
      res.json(palaces);
    } catch (error) {
      console.error("Error fetching palaces:", error);
      res.status(500).json({ error: "Failed to fetch palaces" });
    }
  });

  app.get("/api/palaces/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid palace ID" });
      }
      const palace = await storage.getPalace(id);
      if (!palace) {
        return res.status(404).json({ error: "Palace not found" });
      }
      if (palace.userId !== req.user?.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(palace);
    } catch (error) {
      console.error("Error fetching palace:", error);
      res.status(500).json({ error: "Failed to fetch palace" });
    }
  });

  app.post("/api/palaces", requireAuth, async (req, res) => {
    try {
      const palaceData = { ...req.body, userId: req.user?.id };
      const parsed = insertMemoryPalaceSchema.safeParse(palaceData);
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

  app.put("/api/palaces/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid palace ID" });
      }
      
      const existingPalace = await storage.getPalace(id);
      if (!existingPalace) {
        return res.status(404).json({ error: "Palace not found" });
      }
      if (existingPalace.userId !== req.user?.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const parsed = insertMemoryPalaceSchema.safeParse({ ...req.body, userId: req.user?.id });
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid palace data", details: parsed.error.errors });
      }
      
      const palace = await storage.updatePalace(id, parsed.data);
      res.json(palace);
    } catch (error) {
      console.error("Error updating palace:", error);
      res.status(500).json({ error: "Failed to update palace" });
    }
  });

  app.delete("/api/palaces/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid palace ID" });
      }
      
      const existingPalace = await storage.getPalace(id);
      if (!existingPalace) {
        return res.status(404).json({ error: "Palace not found" });
      }
      if (existingPalace.userId !== req.user?.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const deleted = await storage.deletePalace(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting palace:", error);
      res.status(500).json({ error: "Failed to delete palace" });
    }
  });

  return httpServer;
}
