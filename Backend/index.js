import express from 'express';
import router from "./routes/user.route.js";
import logger from "morgan";
import mongoose from 'mongoose';
import { DBconnection } from './utils/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import JobRouter from './routes/job.route.js';
import ApplicationRouter from './routes/application.route.js';

dotenv.config();

// Cloudinary
cloudinary.config({
  cloud_name: 'dvsodra8s',
  api_key: '854483971888192',
  api_secret: process.env.Cloudinary_api_secret,
});

const app = express();

// ✅ Proper CORS config for both local + Vercel frontend
const allowedOrigins = [
  'http://localhost:5173',
  'https://job-portal-liard-alpha.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

// Routes
app.use("/api/applications", ApplicationRouter);
app.use("/api/user", router);
app.use("/api/jobs", JobRouter);

// DB connection
DBconnection();

// Server start
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
