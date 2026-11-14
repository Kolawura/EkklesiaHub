import { createElement, useRef, useEffect, useState, Suspense } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export const useCaptcha = ({
  tab,
  isPending,
}: {
  tab: string;
  isPending: boolean;
}) => {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const wasPending = useRef(false);

  // Tokens are single-use: reset the widget after every attempt
  useEffect(() => {
    if (wasPending.current && !isPending) {
      turnstileRef.current?.reset();
      setCaptchaToken("");
    }
    wasPending.current = isPending;
  }, [isPending]);

  // Switching tabs remounts the widget, so drop any stale token
  useEffect(() => setCaptchaToken(""), [tab]);

  const captcha = SITE_KEY
    ? createElement(Turnstile, {
        key: tab,
        ref: turnstileRef,
        siteKey: SITE_KEY,
        onSuccess: setCaptchaToken,
        onExpire: () => setCaptchaToken(""),
        onError: () => setCaptchaToken(""),
        options: { size: "flexible" },
      })
    : null;
  const captchaBlocked = !!SITE_KEY && !captchaToken;

  return { captcha, captchaToken, captchaBlocked };
};
