"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import React from "react";

interface AnimatedCheckboxProps {
  value: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AnimatedCheckbox({
  value,
  label,
  checked,
  onChange,
}: AnimatedCheckboxProps) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        color: "#fff",
      }}
    >
      <div style={{ position: "relative", width: 24, height: 24 }}>
        <input
          type="checkbox"
          value={value}
          checked={checked}
          onChange={onChange}
          style={{
            appearance: "none",
            width: "100%",
            height: "100%",
            border: "2px solid #FAB320",
            borderRadius: 4,
            background: checked ? "#FAB320" : "transparent",
            cursor: "pointer",
            transition: "background 0.2s, border-color 0.2s",
          }}
        />
        <AnimatePresence>
          {checked && (
            <motion.div
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Check size={16} strokeWidth={3} color="black" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span style={{ userSelect: "none" }}>{label}</span>
    </label>
  );
}
