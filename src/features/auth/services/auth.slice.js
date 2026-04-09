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

/* ══════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════ */

/** Persist token + set axios default header */
const persistToken = (token) => {
  if (token) localStorage.setItem("token", token);
};

/** Generic rejected handler – surfaces the backend message */
const reject = (err) =>
  err.response?.data || { message: err.message || "Something went wrong" };

/* ══════════════════════════════════════════════════════
   THUNKS
   ══════════════════════════════════════════════════════ */

/* ── Hybrid login/signup (email-password & social) ── */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      /**
       * POST /api/user-signup
       * Body options:
       *   { provider:"email",  email, password }
       *   { provider:"google", idToken }
       *   { provider:"apple",  identityToken }
       *   { provider:"phone",  phoneNumber, password }
       */
      const res = await signup(data);
      persistToken(res.data?.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(reject(err));
    }
  },
);

/* ── Fetch authenticated user ── */
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      // GET /api/get-user-info   (Authorization: Bearer <token>)
      const res = await getUser();
      return res.data;
    } catch (err) {
      return rejectWithValue(reject(err));
    }
  },
);

/* ── Update profile ── */
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      // POST /api/update-profile   Body: { name?, mobile?, image? }
      const res = await updateProfile(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(reject(err));
    }
  },
);

/* ── Delete account ── */
export const deleteAccount = createAsyncThunk(
  "auth/deleteUser",
  async (_, { rejectWithValue }) => {
    try {
      // DELETE /api/delete-user
      const res = await deleteUser();
      localStorage.removeItem("token");
      return res.data;
    } catch (err) {
      return rejectWithValue(reject(err));
    }
  },
);

/* ── Send email OTP (signup) ── */
export const sendEmailOTP = createAsyncThunk(
  "auth/sendEmailOtp",
  async (data, { rejectWithValue }) => {
    try {
      /**
       * POST /api/send-email-otp
       * Body: { email, username, password }
       */
      const res = await sendEmailOtp(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(reject(err));
    }
  },
);

/* ── Verify email OTP → creates account ── */
export const verifyEmailOTP = createAsyncThunk(
  "auth/verifyEmailOtp",
  async (data, { rejectWithValue }) => {
    try {
      /**
       * POST /api/verify-email-otp
       * Body: { email, otp, username, password }
       */
      const res = await verifyEmailOtp(data);
      persistToken(res.data?.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(reject(err));
    }
  },
);

/* ── Send phone OTP ── */
export const sendPhoneOTP = createAsyncThunk(
  "auth/sendPhoneOtp",
  async (data, { rejectWithValue }) => {
    try {
      /**
       * POST /api/send-phone-otp
       * Signup body : { phoneNumber }
       * Login body  : { phoneNumber, password }
       */
      const res = await sendPhoneOtp(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(reject(err));
    }
  },
);

/* ── Verify phone OTP → logs in ── */
export const verifyPhoneOTP = createAsyncThunk(
  "auth/verifyPhoneOtp",
  async (data, { rejectWithValue }) => {
    try {
      /**
       * POST /api/verify-phone-otp
       * Body: { phoneNumber, otp }
       */
      const res = await verifyPhoneOtp(data);
      persistToken(res.data?.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(reject(err));
    }
  },
);

/* ── Legacy OTP ── */
export const getOTP = createAsyncThunk(
  "auth/getOtp",
  async (params, { rejectWithValue }) => {
    try {
      // GET /api/get-otp?phone=...
      const res = await getOtp(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(reject(err));
    }
  },
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOtp",
  async (params, { rejectWithValue }) => {
    try {
      // GET /api/verify-otp?phone=...&otp=...
      const res = await verifyOtp(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(reject(err));
    }
  },
);

/* ══════════════════════════════════════════════════════
   SLICE
   ══════════════════════════════════════════════════════ */

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    otpSent: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* ── Generic pending / rejected helpers ── */
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      /* loginUser */
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user ?? payload;
        state.token = payload.token ?? state.token;
      })
      .addCase(loginUser.rejected, rejected)

      /* fetchUser */
      .addCase(fetchUser.pending, pending)
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user ?? payload;
      })
      .addCase(fetchUser.rejected, rejected)

      /* updateUserProfile */
      .addCase(updateUserProfile.fulfilled, (state, { payload }) => {
        state.user = payload.user ?? payload;
      })

      /* deleteAccount */
      .addCase(deleteAccount.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })

      /* sendEmailOTP */
      .addCase(sendEmailOTP.pending, pending)
      .addCase(sendEmailOTP.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendEmailOTP.rejected, rejected)

      /* verifyEmailOTP */
      .addCase(verifyEmailOTP.pending, pending)
      .addCase(verifyEmailOTP.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user ?? payload;
        state.token = payload.token ?? state.token;
      })
      .addCase(verifyEmailOTP.rejected, rejected)

      /* sendPhoneOTP */
      .addCase(sendPhoneOTP.pending, pending)
      .addCase(sendPhoneOTP.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendPhoneOTP.rejected, rejected)

      /* verifyPhoneOTP */
      .addCase(verifyPhoneOTP.pending, pending)
      .addCase(verifyPhoneOTP.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user ?? payload;
        state.token = payload.token ?? state.token;
      })
      .addCase(verifyPhoneOTP.rejected, rejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;