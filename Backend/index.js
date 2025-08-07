import express from 'express'
import router from "./routes/user.route.js"
import logger from "morgan"
import mongoose from 'mongoose'
import { DBconnection } from './utils/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary';
import JobRouter from './routes/job.route.js'


dotenv.config()
// Cloudinary
cloudinary.config({
  cloud_name: 'dvsodra8s',
  api_key: '854483971888192',
  api_secret: process.env.Cloudinary_api_secret,
});
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
 
app.use(logger('dev'))

app.use("/api/user", router)
app.use("/api/jobs",JobRouter)

DBconnection()

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})
