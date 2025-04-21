import { createSlice } from "@reduxjs/toolkit";
// Helper function to check token validity
const isTokenValid = (token) => {
    if (!token) return false;
  
    // Example: Decode token (if JWT) and check expiration
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = decodedToken.exp * 1000; 
    const expirationDate = new Date(expirationTime);

    // Format the date
    const formattedDate = expirationDate.toLocaleString();  // This gives a local date and time format
    
    console.log("Token expires at: ", formattedDate);
    return Date.now() < expirationTime; 
  };

const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

if (!isTokenValid(storedToken)) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

const authslice=createSlice( {

    name:"auth",
    initialState:{
        user: storedUser || null,
    token: storedToken || null,
    loading: false,
    error: null,

        
    },
    reducers:{
        loginSuccess:(state,action)=>{
            state.user=action.payload.user;
            state.token=action.payload.token;
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
           
        },
        logout:(state)=>{
            state.user=null;
            state.token=null;
                
      localStorage.removeItem("user");
      localStorage.removeItem("token");
            
        }
    }

    }
);
export const {loginSuccess,logout}=authslice.actions;
export default authslice.reducer;