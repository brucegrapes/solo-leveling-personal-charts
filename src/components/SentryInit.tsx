"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/browser";

export function SentryInit() {
  useEffect(() => {
    Sentry.init({
      dsn: "https://85311b83b2734a9191169d48e6036dd4@glitchtip.monarchdomain.in/1",
      tracesSampleRate: 0.1,
      environment: process.env.NODE_ENV || 'development',
    });

    // Expose Sentry globally for testing
    if (typeof window !== 'undefined') {
      (window as any).Sentry = Sentry;
      console.log('Sentry initialized. Test with: window.Sentry.captureException(new Error("Test"))');
    }
  }, []);

  return null;
}
