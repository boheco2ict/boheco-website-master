import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase";
import {
  getEmployeeByUserId,
  getConsumerByUserId,
} from "../services/getservices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [consumerInfo, setConsumerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load employee information
   */
  const loadEmployee = async (user) => {
    if (!user) {
      setEmployeeInfo(null);
      return;
    }

    try {
      const employeeData = await getEmployeeByUserId(user.id);
      setEmployeeInfo(employeeData || null);
    } catch (error) {
      console.error("Error loading employee:", error);
      setEmployeeInfo(null);
    }
  };

  /**
   * Load consumer information
   */
  const loadConsumer = async (user) => {
    if (!user) {
      setConsumerInfo(null);
      return;
    }

    try {
      const consumerData = await getConsumerByUserId(user.id);

      setConsumerInfo(consumerData || null);
    } catch (error) {
      console.error("Error loading consumer:", error);
      setConsumerInfo(null);
    }
  };

  /**
   * Load information associated with the authenticated user
   */
  const loadUserInformation = async (currentUser) => {
    const loginProvider = currentUser?.app_metadata?.provider || null;
    
    if (!currentUser) {
      setEmployeeInfo(null);
      setConsumerInfo(null);
      return;
    }

    if (loginProvider === "email") {
      await loadEmployee(currentUser);
      setConsumerInfo(null);
    }
    if (loginProvider === "google") {
      await loadConsumer(currentUser);
      setEmployeeInfo(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    /**
     * Get the current Supabase session
     */
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);

          if (mounted) {
            setUser(null);
            setEmployeeInfo(null);
            setConsumerInfo(null);
          }

          return;
        }

        const currentUser = session?.user || null;

        if (!mounted) return;

        setUser(currentUser);

        if (currentUser) {
          await loadUserInformation(currentUser);
        } else {
          setEmployeeInfo(null);
          setConsumerInfo(null);
        }
      } catch (error) {
        console.error("Error getting session:", error);

        if (mounted) {
          setUser(null);
          setEmployeeInfo(null);
          setConsumerInfo(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    /**
     * Listen for Supabase authentication changes
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null;

        if (!mounted) return;

        setUser(currentUser);

        if (currentUser) {
          await loadUserInformation(currentUser);
        } else {
          setEmployeeInfo(null);
          setConsumerInfo(null);
        }

        if (mounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        employeeInfo,
        consumerInfo,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);