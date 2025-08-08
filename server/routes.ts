import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuestionnaireResponseSchema, insertProfessionalSignupSchema, insertContactSubmissionSchema } from "../shared/schema.js";

// Admin authentication middleware
const requireAdmin = (req: any, res: any, next: any) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Questionnaire routes
  app.post("/api/questionnaire/submit", async (req, res) => {
    try {
      const validatedData = insertQuestionnaireResponseSchema.parse(req.body);
      const response = await storage.createQuestionnaireResponse(validatedData);
      res.json(response);
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      res.status(400).json({ error: "Invalid questionnaire data" });
    }
  });

  app.get("/api/questionnaire/responses", requireAdmin, async (req, res) => {
    try {
      const responses = await storage.getAllQuestionnaireResponses();
      res.json(responses);
    } catch (error) {
      console.error("Error fetching questionnaire responses:", error);
      res.status(500).json({ error: "Failed to fetch responses" });
    }
  });

  // Professional signup routes
  app.post("/api/professionals", async (req, res) => {
    try {
      const validatedData = insertProfessionalSignupSchema.parse(req.body);
      const signup = await storage.createProfessionalSignup(validatedData);
      res.json(signup);
    } catch (error) {
      console.error("Error creating professional signup:", error);
      res.status(400).json({ error: "Invalid signup data" });
    }
  });

  app.get("/api/professionals", requireAdmin, async (req, res) => {
    try {
      const signups = await storage.getAllProfessionalSignups();
      res.json(signups);
    } catch (error) {
      console.error("Error fetching professional signups:", error);
      res.status(500).json({ error: "Failed to fetch signups" });
    }
  });

  // Contact form routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.json(submission);
    } catch (error) {
      console.error("Error creating contact submission:", error);
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  app.get("/api/contact", requireAdmin, async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ error: "Failed to fetch contact submissions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
