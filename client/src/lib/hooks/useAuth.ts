import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, updateProfile } from "../firebase";
import { 
  User as FirebaseUser, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      // First check if Firebase is properly initialized
      if (!auth) {
        throw new Error("Firebase authentication has not been initialized");
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      console.log("Signup error details:", error);
      
      let errorMessage = "Failed to create account";
      
      // Provide more user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email is already in use. Please use a different email.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email address is not valid.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Firebase authentication is not properly configured.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Check if Firebase is properly initialized
      if (!auth) {
        throw new Error("Firebase authentication has not been initialized");
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Signed in",
        description: "You have been signed in successfully.",
      });
    } catch (error: any) {
      console.log("Login error details:", error);
      
      let errorMessage = "Failed to sign in";
      
      // Provide more user-friendly error messages
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email address is not valid.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Firebase authentication is not properly configured.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signUp,
    signIn,
    logOut,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};
