"use client";

import { Card, Input, Button } from "../../components/common";
import { motion } from "framer-motion";

export default function SignupForm() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card title="Sign Up">
        <form className="space-y-4">
          <Input
            label="Name"
            type="text"
            placeholder="Your name"
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
          />
          <Button
            type="submit"
            className="w-full"
          >
            Create Account
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
