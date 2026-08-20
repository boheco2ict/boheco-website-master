import { createContext, useContext, useState, useEffect } from "react";

import { supabase } from "../supabase";

import { getEmployeeByUserId } from "../services/getservices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get employee information using Supabase Auth user ID
  const loadEmployee = async (user) => {
    if (!user) {
      setEmployeeInfo(null);
      return;
    }

    try {
      const employeeData = await getEmployeeByUserId(user.id);

      setEmployeeInfo(employeeData);
    } catch (error) {
      console.error("Error loading employee:", error);
      setEmployeeInfo(null);
    }
  };

  useEffect(() => {
    // Get Current Session
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const currentUser = session?.user || null;

        setUser(currentUser);

        if (currentUser) {
          await loadEmployee(currentUser);
        } else {
          setEmployeeInfo(null);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        setUser(null);
        setEmployeeInfo(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen For Auth Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null;

      setUser(currentUser);

      if (currentUser) {
        await loadEmployee(currentUser);
      } else {
        setEmployeeInfo(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        employeeInfo,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);