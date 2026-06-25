"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

export function AnimatedButton({ children, className, ...props }: ButtonProps) {
  const isFullWidth = typeof className === "string" ? className.includes("w-full") : false;
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={isFullWidth ? "w-full" : "inline-block"}
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}
