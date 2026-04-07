import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signup,
  getUser,
  updateProfile,
  deleteUser,
  sendEmailOtp,
  verifyEmailOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
  getOtp,
  verifyOtp,
} from "./auth.api";

/* =========================
   THUNKS
========================= */

// Login / Signup
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await signup(data);

      // Save token if exists
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// Get User
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUser();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// Update Profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateProfile(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// Delete User
export const deleteAccount = createAsyncThunk(
  "auth/deleteUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await deleteUser();
      localStorage.removeItem("token");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* =========================
   OTP (EMAIL)
========================= */

export const sendEmailOTP = createAsyncThunk(
  "auth/sendEmailOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await sendEmailOtp(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const verifyEmailOTP = createAsyncThunk(
  "auth/verifyEmailOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await verifyEmailOtp(data);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* =========================
   OTP (PHONE)
========================= */

export const sendPhoneOTP = createAsyncThunk(
  "auth/sendPhoneOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await sendPhoneOtp(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const verifyPhoneOTP = createAsyncThunk(
  "auth/verifyPhoneOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await verifyPhoneOtp(data);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* =========================
   LEGACY OTP
========================= */

export const getOTP = createAsyncThunk(
  "auth/getOtp",
  async (params, { rejectWithValue }) => {
    try {
      const res = await getOtp(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOtp",
  async (params, { rejectWithValue }) => {
    try {
      const res = await verifyOtp(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* =========================
   SLICE
========================= */

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    otpSent: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder

      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH USER */
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      /* UPDATE PROFILE */
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      /* DELETE ACCOUNT */
      .addCase(deleteAccount.fulfilled, (state) => {
        state.user = null;
      })

      /* EMAIL OTP */
      .addCase(sendEmailOTP.fulfilled, (state) => {
        state.otpSent = true;
      })
      .addCase(verifyEmailOTP.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })

      /* PHONE OTP */
      .addCase(sendPhoneOTP.fulfilled, (state) => {
        state.otpSent = true;
      })
      .addCase(verifyPhoneOTP.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;