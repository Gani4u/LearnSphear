// creating redux store
import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./AuthSlice";
export const store =configureStore({
    reducer:{
        auth:authreducer,
    },
});