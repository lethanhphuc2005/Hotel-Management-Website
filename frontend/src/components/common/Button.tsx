"use client";

import { motion } from "framer-motion";
import React from "react";
import style from "@/styles/components/button.module.css";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function AnimatedButton({
  children,
  onClick,
  className = "",
}: AnimatedButtonProps) {
  return (
    <motion.button
      className={`${style.button} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
