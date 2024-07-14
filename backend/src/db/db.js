import mongoose from "mongoose"

const mongoDbConnection= async()=>{
try {
    const dbconnection = await mongoose.connect(process.env.MONGODB_URL)
    console.log("mongodb connection sucessfully",dbconnection.connection.host);
} catch (error) {
    console.log("mongodb connection failed", error);
}
}
export default mongoDbConnection