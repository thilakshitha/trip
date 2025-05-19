import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Basic User API Route - client will handle user operations directly with Firebase
  app.get("/api/users/:uid", async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;
      res.json({ uid });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || "Failed to fetch user",
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
