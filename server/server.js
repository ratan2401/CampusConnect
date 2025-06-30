const express=require("express")
const dotenv=require("dotenv")
const cors=require("cors")

const connectDB=require("./dbConfig/dbConfig")

const authRouter=require("./routes/authRoute")
const userRouter=require("./routes/userRoute")
const postRouter = require("./routes/postRoute");
const notificationRouter = require("./routes/notificationRoute");

dotenv.config()
const app=express()
const port=3000

app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.use("/api/auth",authRouter)
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/notification", notificationRouter);
app.use("/images",express.static("uploads"));
app.use("/uploads", express.static("uploads"));

app.get("/",(req,res)=>{
    res.send("Hello World!")
})


connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`http://localhost:${port}`)
    })

})

