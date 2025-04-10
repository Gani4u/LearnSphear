import { createSlice } from "@reduxjs/toolkit";
const authslice=createSlice( {
    name:"auth",
    initialState:{
        user:null,   
        token:null,
        loading:false,
        error:null,

        
    },
    reducers:{
        loginSuccess:(state,action)=>{
            state.user=action.payload.user;
            state.token=action.payload.token;
        },
        logout:(state)=>{
            state.user=null;
            state.token=null;
            //state.role=null;
            
        }
    }

    }
);
export const {loginSuccess,logout}=authslice.actions;
export default authslice.reducer;