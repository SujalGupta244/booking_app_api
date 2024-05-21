const axios = require("axios");
exports.generateAccessToken = generateAccessToken;

async function generateAccessToken(req, res, next) {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const response = await axios({
      url: `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
      method: "post",
      data: "grant_type=client_credentials",
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET,
      },
    });
    const data = await response.data;
    req.body.access_token = data.access_token;
    next();
  } catch (error) {
    console.error("Failed to generate Access Token");
    throw new Error(error.message);
  }
}
