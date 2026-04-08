import apiClient from "../../../api/apiClient";

/* ── Auth / User ─────────────────────────────────────────────────────────── */

/**
 * Hybrid signup / login.
 * @param {{ provider: "phone"|"email"|"google"|"apple",
 *           phoneNumber?: string,
 *           password?: string,
 *           email?: string,
 *           idToken?: string,
 *           identityToken?: string }} data
 */
export const signup = (data) => apiClient.post("/api/user-signup", data);

/** Fetch authenticated user info (requires token in header). */
export const getUser = () => apiClient.get("/api/get-user-info");

/**
 * Update user profile.
 * @param {{ name?: string, mobile?: string, image?: File|string }} data
 */
export const updateProfile = (data) =>
  apiClient.post("/api/update-profile", data);

/** Permanently delete the authenticated user. */
export const deleteUser = () => apiClient.delete("/api/delete-user");

/* ── Email OTP ───────────────────────────────────────────────────────────── */

/**
 * Send OTP to email (signup flow).
 * @param {{ email: string, username: string, password: string }} data
 */
export const sendEmailOtp = (data) =>
  apiClient.post("/api/send-email-otp", data);

/**
 * Verify email OTP and create the account.
 * @param {{ email: string, otp: string, username: string, password: string }} data
 */
export const verifyEmailOtp = (data) =>
  apiClient.post("/api/verify-email-otp", data);

/* ── Phone OTP ───────────────────────────────────────────────────────────── */

/**
 * Send OTP to phone number.
 * Signup: { phoneNumber }
 * Login : { phoneNumber, password }
 * @param {{ phoneNumber: string, password?: string }} data
 */
export const sendPhoneOtp = (data) =>
  apiClient.post("/api/send-phone-otp", data);

/**
 * Verify phone OTP.
 * @param {{ phoneNumber: string, otp: string }} data
 */
export const verifyPhoneOtp = (data) =>
  apiClient.post("/api/verify-phone-otp", data);

/* ── Legacy OTP ──────────────────────────────────────────────────────────── */

/** @param {{ phone: string }} params */
export const getOtp = (params) => apiClient.get("/api/get-otp", { params });

/** @param {{ phone: string, otp: string }} params */
export const verifyOtp = (params) =>
  apiClient.get("/api/verify-otp", { params });
