import type { Express } from "express";
import { createServer, type Server } from "http";

// Admin authentication middleware
const requireAdmin = (req: any, res: any, next: any) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Admin test endpoint
  app.get("/api/admin/test", requireAdmin, (req, res) => {
    res.json({ message: "Admin access confirmed" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
