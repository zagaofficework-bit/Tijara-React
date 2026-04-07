import apiClient from "../../services/apiClient";

/* =========================
   AUTH / USER APIs
========================= */

// Hybrid Signup / Login (email, google, phone, apple)
export const signup = (data) =>
  apiClient.post("/api/user-signup", data);

// Get logged-in user info
export const getUser = () =>
  apiClient.get("/api/get-user-info");

// Update profile
export const updateProfile = (data) =>
  apiClient.post("/api/update-profile", data);

// Delete account
export const deleteUser = () =>
  apiClient.delete("/api/delete-user");


/* =========================
   EMAIL OTP APIs
========================= */

// Send OTP to email
export const sendEmailOtp = (data) =>
  apiClient.post("/api/send-email-otp", data);

// Verify email OTP
export const verifyEmailOtp = (data) =>
  apiClient.post("/api/verify-email-otp", data);


/* =========================
   PHONE OTP APIs
========================= */

// Send OTP to phone
export const sendPhoneOtp = (data) =>
  apiClient.post("/api/send-phone-otp", data);

// Verify phone OTP
export const verifyPhoneOtp = (data) =>
  apiClient.post("/api/verify-phone-otp", data);


/* =========================
   LEGACY OTP APIs
========================= */

// Get OTP (legacy)
export const getOtp = (params) =>
  apiClient.get("/api/get-otp", { params });

// Verify OTP (legacy)
export const verifyOtp = (params) =>
  apiClient.get("/api/verify-otp", { params });
