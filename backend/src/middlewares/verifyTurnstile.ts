import { Request, Response, NextFunction } from "express";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const verifyTurnstile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Dev convenience only: skip when unset. In production, fail closed.
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("TURNSTILE_SECRET_KEY is not set");
      return res
        .status(500)
        .json({ success: false, message: "Verification unavailable" });
    }
    return next();
  }

  const token = req.body?.turnstileToken;
  if (typeof token !== "string" || !token || token.length > 2048) {
    return res
      .status(400)
      .json({ success: false, message: "Please complete the verification" });
  }

  try {
    const form = new URLSearchParams({ secret, response: token });
    if (req.ip) form.set("remoteip", req.ip);

    const r = await fetch(VERIFY_URL, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(5000),
    });
    const data = (await r.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    if (!data.success) {
      console.warn("Turnstile rejected:", data["error-codes"]);
      return res.status(400).json({
        success: false,
        message: "Verification failed. Please try again.",
      });
    }

    delete req.body.turnstileToken; // keep it out of the controllers
    return next();
  } catch (err) {
    console.error("Turnstile siteverify error:", err);
    return res
      .status(503)
      .json({ success: false, message: "Verification service unavailable" });
  }
};
