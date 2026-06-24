const otpStore = new Map();

/*
Structure:
otpStore.set(email, {
  otp: "123456",
  expiresAt: Date.now() + 5 * 60 * 1000
})
*/

export default otpStore;