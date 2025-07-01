"use client";

import { motion } from "framer-motion";
import React from "react";
import style from "@/styles/components/button.module.css";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  className?: string;
}

export function AnimatedButton({
  children,
  onClick,
  className = "",
}: AnimatedButtonProps) {
  return (
    <motion.button className={`${className} ${style.button}`} onClick={onClick}>
      {children}
    </motion.button>
  );
}

export function AnimatedButtonPrimary({
  children,
  onClick,
  className = "",
}: AnimatedButtonProps) {
  return (
    <motion.button
      className={`${className} ${style.buttonPrimary}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

export function AnimatedButtonLink({
  children,
  onClick,
  className = "",
}: AnimatedButtonProps) {
  return (
    <motion.button
      className={`${className} ${style.buttonLink}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
