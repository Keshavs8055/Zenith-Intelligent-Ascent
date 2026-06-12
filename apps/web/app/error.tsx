"use client";

import { useEffect } from "react";
import { Button } from "./components/common";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("UI Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-[#e5e5e5] flex flex-col items-center justify-center space-y-6 font-mono p-6">
      <h2 className="text-xl tracking-widest uppercase text-red-500">System Malfunction</h2>
      <p className="text-sm text-gray-500 max-w-md text-center">
        An unexpected error occurred in the interface. Our avoidance scores have been notified.
      </p>
      <Button variant="secondary" onClick={() => reset()} className="mt-4 uppercase tracking-widest text-xs">
        Attempt Recovery
      </Button>
    </div>
  );
}
