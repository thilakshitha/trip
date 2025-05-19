import admin from "firebase-admin";

let firebaseApp: admin.app.App;

export function getFirebaseAdmin() {
  if (!firebaseApp) {
    // Initialize Firebase Admin with credentials
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
    
    // Check if running in production or if we have service account credentials
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(
          process.env.FIREBASE_SERVICE_ACCOUNT
        );
        
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId,
        });
      } catch (error) {
        console.error("Error initializing Firebase Admin:", error);
        
        // Fallback to application default credentials
        firebaseApp = admin.initializeApp({
          projectId,
        });
      }
    } else {
      console.log("Initializing Firebase Admin with application default credentials");
      // Use application default credentials
      firebaseApp = admin.initializeApp({
        projectId,
      });
    }
  }
  
  return { firebaseAdmin: firebaseApp };
}
