import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { worldFormSchema, worldOutputSchema } from "@shared/schema";
import { generateWorld, generateDMScript, generatePlayerSheets } from "./anthropic";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // World generation endpoint
  app.post("/api/generate", async (req: Request, res: Response) => {
    try {
      // Validate the input form data
      const formData = worldFormSchema.parse(req.body);
      
      // Generate world using Claude API
      const generatedWorld = await generateWorld(formData);
      
      // Validate the output
      const validatedOutput = worldOutputSchema.parse(generatedWorld);
      
      res.json(validatedOutput);
    } catch (error) {
      console.error("Error generating world:", error);
      
      if (error instanceof ZodError) {
        // Handle validation errors
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate world" 
      });
    }
  });
  
  // Get all saved worlds
  app.get("/api/worlds", async (_req: Request, res: Response) => {
    try {
      const worlds = await storage.getSavedWorlds();
      res.json(worlds);
    } catch (error) {
      console.error("Error getting saved worlds:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get saved worlds" 
      });
    }
  });
  
  // Get a single saved world by ID
  app.get("/api/worlds/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid world ID" });
      }
      
      const world = await storage.getSavedWorld(id);
      if (!world) {
        return res.status(404).json({ message: "World not found" });
      }
      
      res.json(world);
    } catch (error) {
      console.error("Error getting saved world:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get saved world" 
      });
    }
  });
  
  // Create a new saved world
  app.post("/api/worlds", async (req: Request, res: Response) => {
    try {
      const { name, formData, output } = req.body;
      
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: "World name is required" });
      }
      
      // Validate form data
      const validatedFormData = worldFormSchema.parse(formData);
      
      // Validate output if provided
      let validatedOutput = undefined;
      if (output) {
        validatedOutput = worldOutputSchema.parse(output);
      }
      
      const savedWorld = await storage.createSavedWorld({
        name,
        formData: validatedFormData,
        output: validatedOutput
      });
      
      res.status(201).json(savedWorld);
    } catch (error) {
      console.error("Error saving world:", error);
      
      if (error instanceof ZodError) {
        // Handle validation errors
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to save world" 
      });
    }
  });
  
  // Delete a saved world
  app.delete("/api/worlds/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid world ID" });
      }
      
      const world = await storage.getSavedWorld(id);
      if (!world) {
        return res.status(404).json({ message: "World not found" });
      }
      
      await storage.deleteSavedWorld(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting saved world:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to delete saved world" 
      });
    }
  });
  
  // Generate DM Script endpoint
  app.post("/api/generate-dm-script", async (req: Request, res: Response) => {
    try {
      // Validate the world output
      const worldOutput = worldOutputSchema.parse(req.body);
      
      // Generate DM script using Claude API
      const dmScript = await generateDMScript(worldOutput);
      
      res.json({ dmScript });
    } catch (error) {
      console.error("Error generating DM script:", error);
      
      if (error instanceof ZodError) {
        // Handle validation errors
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate DM script" 
      });
    }
  });
  
  // Generate Player Sheets endpoint
  app.post("/api/generate-player-sheets", async (req: Request, res: Response) => {
    try {
      // Validate the world output
      const worldOutput = worldOutputSchema.parse(req.body);
      
      // Generate player sheets using Claude API
      const playerSheets = await generatePlayerSheets(worldOutput);
      
      res.json({ playerSheets });
    } catch (error) {
      console.error("Error generating player sheets:", error);
      
      if (error instanceof ZodError) {
        // Handle validation errors
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate player sheets" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
