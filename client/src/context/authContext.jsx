import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext=createContext(null)

const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

   const [token,setToken]=useState("")
   const [user,setUser]=useState({})

   const contextValue={token,setToken,user,setUser  }

   useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      
    }
   },[])

   useEffect(() => {
    const fetchUser = async () => { 
      if (!token) return;

      try {
        const response = await fetch("http://localhost:3000/api/user/profile", {
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }    
    fetchUser();
  }, [token]);

    useEffect(() => {
    if (token && user.username) {
      //navigate(`/home/${user.username}`);
    }
  }, [token, user, navigate]);
  


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth=()=>useContext(AuthContext)

export { AuthContextProvider,useAuth };