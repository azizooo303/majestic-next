"use client";
import { motion } from "framer-motion";

export function PageWrapper({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <motion.main
      id={id}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </motion.main>
  );
}
