// src/features/JobSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk to fetch all jobs
const BASE_URL = import.meta.env.VITE_ORIGINAL_BASE_URL;


export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const response = await axios.get(`${BASE_URL}/api/jobs`, { withCredentials: true });
  return response.data.jobs;
});

export const createJob = createAsyncThunk("jobs/createJob", async (jobData, thunkAPI) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/jobs`, jobData, { withCredentials: true });
    return response.data.job;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});


const JobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
        state.loading = false;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch jobs";
        state.loading = false;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload); // Add the new job to the list
      });
  },
});

export default JobSlice.reducer;
