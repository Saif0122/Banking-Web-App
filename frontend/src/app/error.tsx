"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // We could log to Sentry here, but sticking to console for now per requirements
    console.error("Global boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl"
      >
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Something went wrong</h1>
          <p className="text-muted-foreground">
            We apologize for the inconvenience. An unexpected error has occurred in our system.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
          <Button onClick={() => reset()} size="lg" className="gap-2">
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => router.push("/")}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
