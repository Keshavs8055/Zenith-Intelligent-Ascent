"use client";

import {
  Home,
  CheckSquare,
  BarChart3,
  Settings,
  LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

/* ----------------- ProgressBar ----------------- */
export interface ProgressBarProps {
  value: number; // percentage 0–100
}

export function ProgressBar({ value }: ProgressBarProps) {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
      <div
        className="bg-indigo-500 h-2 transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

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

/* ----------------- MobileNav ----------------- */
interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Tasks", icon: CheckSquare, href: "/tasks" },
  { label: "Progress", icon: BarChart3, href: "/progress" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-black/40 backdrop-blur-md border-t border-gray-800 flex justify-around py-2">
      {navItems.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          className="flex flex-col items-center text-xs text-gray-400 hover:text-white"
        >
          <Icon size={20} />
          {label}
        </a>
      ))}
    </nav>
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
