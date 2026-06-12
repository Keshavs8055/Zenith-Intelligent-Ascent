"use client";

import {
  LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import Link from "next/link";



/* ----------------- Modal ----------------- */
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {children}
            <button
              onClick={onClose}
              className="mt-4 w-full rounded-lg bg-gray-800 text-gray-300 py-2 hover:bg-gray-700"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



/* ----------------- Card ----------------- */
export interface CardProps {
  title?: string;
  children: ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-2xl bg-white/5 border border-gray-800 backdrop-blur-md p-5">
      {title && (
        <h3 className="text-lg font-medium mb-2 text-white">{title}</h3>
      )}
      <div>{children}</div>
    </div>
  );
}

/* ----------------- Input ----------------- */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-gray-400 mb-1">{label}</label>
      )}
      <input
        {...props}
        className={cn(
          "w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-gray-100",
          "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent outline-none",
          "placeholder-gray-500"
        )}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

/* ----------------- Button ----------------- */
const buttonStyles = cva(
  "rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-400",
        secondary:
          "bg-gray-800 text-gray-100 hover:bg-gray-700 focus:ring-gray-500",
        ghost:
          "bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/40",
      },
      size: {
        sm: "text-sm px-3 py-1.5",
        md: "text-base px-4 py-2",
        lg: "text-lg px-6 py-3",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    />
  );
}

export function Logo() {
  return (
    <AnimatePresence>
      <Link href="/">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-logo text-center m-0 p-0"
        >
          Zenith
        </motion.span>
      </Link>
    </AnimatePresence>
  );
}
