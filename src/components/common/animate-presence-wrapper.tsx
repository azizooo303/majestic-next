"use client";
import { AnimatePresence } from "framer-motion";

export function AnimatePresenceWrapper({ children }: { children: React.ReactNode }) {
  return <AnimatePresence mode="sync">{children}</AnimatePresence>;
}
