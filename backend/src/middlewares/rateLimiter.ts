import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, please try again later.",
  // The Bible API has its own, higher limit (bibleLimiter below): reading one
  // chapter makes several requests, so 200 per 15 minutes is far too low for it.
  skip: (req) => req.path.startsWith("/api/bible"),
});

// Public, read-only, cached scripture data (see bible/routes). Generous, but
// still bounded so a runaway client or scraper cannot hammer the Bible DB.
export const bibleLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3000,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
