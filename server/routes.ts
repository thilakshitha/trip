import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { getFirebaseAdmin } from "./firebaseAdmin";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Firebase Admin
  const { firebaseAdmin } = getFirebaseAdmin();

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // User API Routes
  app.get("/api/users/:uid", async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;
      const userRecord = await firebaseAdmin.auth().getUser(uid);
      res.json({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      });
    } catch (error: any) {
      res.status(error.code === 'auth/user-not-found' ? 404 : 500).json({
        error: error.message,
      });
    }
  });

  // Equipment Lists API Routes
  app.get("/api/equipment-lists/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      const db = firebaseAdmin.firestore();
      const snapshot = await db.collection('equipmentLists')
        .where('userId', '==', userId)
        .get();

      if (snapshot.empty) {
        return res.json([]);
      }

      const lists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      res.json(lists);
    } catch (error: any) {
      console.error("Error fetching equipment lists:", error);
      res.status(500).json({
        error: error.message || "Failed to fetch equipment lists"
      });
    }
  });

  app.post("/api/equipment-lists", async (req: Request, res: Response) => {
    try {
      const { userId, listTitle, items } = req.body;
      
      if (!userId || !listTitle) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const db = firebaseAdmin.firestore();
      const docRef = await db.collection('equipmentLists').add({
        userId,
        listTitle,
        items: items || [],
        createdAt: new Date()
      });

      res.status(201).json({
        id: docRef.id,
        userId,
        listTitle,
        items: items || [],
        createdAt: new Date()
      });
    } catch (error: any) {
      console.error("Error creating equipment list:", error);
      res.status(500).json({
        error: error.message || "Failed to create equipment list"
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
