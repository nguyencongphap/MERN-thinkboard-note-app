import ratelimit from "../config/upstash.js";

// we'll use this middleware in server.js with .use
const rateLimiter = async (req, res, next) => {
  try {
    // normally we put userId here so each user is limited separately but we don't have authentication to have userId.
    // With "my-limit-key", if a user exceeds the rate limit, everyone will be blocked by the server
    const { success } = await ratelimit.limit("my-limit-key");

    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later" });
    }

    next();
  } catch (error) {
    console.log("Rate limit error", error);
    next(error);
  }
};

export default rateLimiter;
