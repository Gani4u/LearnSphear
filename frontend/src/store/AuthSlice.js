import { createSlice } from "@reduxjs/toolkit";
const authslice=createSlice( {
    name:"auth",
    initialState:{
        user:null,
        token:null,
        loading:false,
        error:null,
        //role:null,
        role1:"student"
    },
    reducers:{
        loginSuccess:(state,action)=>{
            state.user=action.payload.user;
            state.token=action.payload.token;
           // state.role=action.payload.role;
           state.role1=action.payload.role1;
        },
        logout:(state)=>{
            state.user=null;
            state.token=null;
            //state.role=null;
            state.role1=null;
        }
    }

    }
);
export const {loginSuccess,logout}=authslice.actions;
export default authslice.reducer;