// src/context/UserContext.jsx

import React, { createContext, useState, useEffect } from "react";
// Import the initAuth and loginII functions from iiAuth.js
import { initAuth, getAuthClient, loginII as iiLoginFunction } from "../services/iiAuth";
import { useNavigate } from "react-router-dom";
import { Principal } from '@dfinity/principal'; // IMPORTANT: Import Principal

export const UserContext = createContext({});

export function UserProvider({ children }) {
  // Initialize iiPrincipal as null. It will store the Principal OBJECT.
  const [iiPrincipal, setIIPrincipal] = useState(null);
  const [authClient, setAuthClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    initAuth().then(async (client) => {
      setAuthClient(client);
      const isAuth = await client.isAuthenticated();
      if (isAuth) {
        const principalObject = client.getIdentity().getPrincipal(); // Get the Principal OBJECT
        setIIPrincipal(principalObject); // Store the Principal OBJECT
        console.log("UserContext: Initial auth check - Logged in as:", principalObject.toText());
      } else {
        setIIPrincipal(null); // Ensure it's null if not authenticated
        console.log("UserContext: Initial auth check - Not logged in.");
      }
      setLoading(false);
    }).catch(error => {
      console.error("UserContext: Error during initial auth setup:", error);
      setIIPrincipal(null);
      setLoading(false);
    });
  }, []);

  // Use the imported loginII function directly
  const loginII = async () => {
    if (!authClient) {
      console.error("AuthClient not initialized. Cannot log in.");
      return;
    }
    await iiLoginFunction({
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principalObject = identity.getPrincipal(); // Get the Principal OBJECT
        console.log("✅ Login successful. Principal:", principalObject.toText());
        setIIPrincipal(principalObject); // Store the Principal OBJECT
        navigate("/explore");
      },
      onError: (error) => { // Add onError callback for better UX
        console.error("Login failed:", error);
        setIIPrincipal(null);
        // Optionally show a toast notification here
        // toast.error("Login failed. Please try again.");
      }
    });
  };

  const logout = async () => {
    if (authClient) {
      await authClient.logout();
      setIIPrincipal(null); // Set to null after logout
      console.log("UserContext: Logged out.");
      navigate("/");
    }
  };

  return (
    <UserContext.Provider value={{ iiPrincipal, loginII, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}
