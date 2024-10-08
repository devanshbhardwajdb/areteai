import mongoose from "mongoose";

let isConnected = false;

const connectDB = async ()=> {
    mongoose.set("strictQuery", true)

    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }
   
        try {
            await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI, {
                dbName: "areteai"

            })
            isConnected = true;
            console.log("MongoDB connected")
        } catch (error) {
            console.log("Yahan error hai",error);
        }
    
}

export default connectDB;