import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth, googleProvider, hasFirebaseConfig } from "../../services/firebaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return () => {};
    }

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      hasFirebase: Boolean(auth) && hasFirebaseConfig,
      signUp: async (email, password) => {
        if (!auth) return { error: new Error("Firebase is not configured.") };
        try {
          const data = await createUserWithEmailAndPassword(auth, email, password);
          return { data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      signIn: async (email, password) => {
        if (!auth) return { error: new Error("Firebase is not configured.") };
        try {
          const data = await signInWithEmailAndPassword(auth, email, password);
          return { data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      signOut: async () => {
        if (!auth) return;
        await firebaseSignOut(auth);
      },
      signInWithGoogle: async () => {
        if (!auth || !googleProvider) return { error: new Error("Firebase is not configured.") };
        try {
          const data = await signInWithPopup(auth, googleProvider);
          return { data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
