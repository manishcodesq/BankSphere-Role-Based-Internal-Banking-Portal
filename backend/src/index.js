import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/dbconnect.js";
import { app } from "./app.js";

dotenv.config({
    path:'./.env'
})
console.log("URI RECEIVED =", process.env.MONGO_URI);



connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
        console.log(mongoose.connection.name);

    });
})
.catch((err) => {
    console.error("Database connection error:", err);
});




/*
 approach to connect DB- not professional 

(async() =>{
    try {
       await mongoose.connect(`${process.env.MongoDB_URI}/${DB_Name}`)
    } catch (error) {
        app.on("error",(error) =>{
            console.error("Error: ",error)
            throw err
        })
        console.error("Error: ",error)
        throw err
    }
})()*/
