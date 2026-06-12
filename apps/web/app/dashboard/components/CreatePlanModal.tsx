"use client";

import { useState } from "react";
import { Modal, Input, Button } from "../../components/common";
import { apiFetch } from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface CreatePlanModalProps {
  open: boolean;
  onClose: () => void;
  onPlanCreated: (plan: any) => void;
}

export function CreatePlanModal({ open, onClose, onPlanCreated }: CreatePlanModalProps) {
  const [prompt, setPrompt] = useState("");
  const [deadline, setDeadline] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: any = { prompt, hoursPerDay };
      if (deadline) {
        payload.deadline = new Date(deadline).toISOString();
      }

      const res = await apiFetch("/plan/generate", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      
      onPlanCreated(res.data);
      onClose();
      // Reset form on success
      setPrompt("");
      setDeadline("");
      setHoursPerDay(1);
    } catch (err: any) {
      setError(err.message || "Failed to create plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="mb-6">
        <h2 className="text-xl font-medium text-white mb-2">Create New Plan</h2>
        <p className="text-sm text-gray-400">Describe what you want to learn or achieve, and let AI beautifully schedule your journey.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg overflow-hidden"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full">
          <label className="block text-sm text-gray-400 mb-1">What's your goal? (Required)</label>
          <textarea
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none resize-none placeholder-gray-500 min-h-[100px]"
            placeholder="E.g., I want to learn intermediate SQL over the next month."
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <Input
          label="Deadline (Optional)"
          type="date"
          value={deadline}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeadline(e.target.value)}
          disabled={loading}
        />

        <Input
          label="Hours Dedicated per Day"
          type="number"
          min={1}
          max={24}
          value={hoursPerDay}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHoursPerDay(Number(e.target.value))}
          disabled={loading}
        />

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={loading || prompt.trim().length < 5}
        >
          {loading ? "AI is generating plan..." : "Generate AI Plan"}
        </Button>
      </form>
    </Modal>
  );
}
