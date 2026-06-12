import { useState, useEffect } from "react";
import { Task } from "@zenith/types";
import { apiFetch } from "../../lib/api";

type Props = {
  task: Task;
  onComplete: () => void;
  onSkip: () => void;
  onClose: () => void;
};

export function FocusMode({ task, onComplete, onSkip, onClose }: Props) {
  const [time, setTime] = useState(25 * 60); // 25 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionInput, setReflectionInput] = useState("");

  useEffect(() => {
    if (isPaused || showCompletion || showReflection) return;
    
    if (time <= 0) {
      setShowCompletion(true);
      return;
    }

    const interval = setInterval(() => {
      setTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time, isPaused, showCompletion, showReflection]);

  const handleEnd = () => {
    setShowCompletion(true);
  };

  const handleYes = async () => {
    try {
      await apiFetch(`/tasks/${task.id}/progress`, {
        method: "PATCH",
        body: JSON.stringify({ action: "complete_pomodoro" })
      });
      onComplete();
    } catch (err) {
      console.error(err);
      alert("Failed to save progress");
    }
  };

  const handleContinue = () => {
    setTime(25 * 60);
    setShowCompletion(false);
  };

  const handleSkip = () => {
    setShowCompletion(false);
    setShowReflection(true);
  };

  const submitReflection = async () => {
    try {
      await apiFetch(`/tasks/${task.id}/progress`, {
        method: "PATCH",
        body: JSON.stringify({ 
          action: "skip", 
          reflection: { reason: reflectionInput || "No reason provided" } 
        })
      });
      onSkip();
    } catch (err) {
      console.error(err);
      alert("Failed to submit reflection");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full mx-auto flex flex-col items-center text-center space-y-12">
        
        {!showCompletion && !showReflection && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <h2 className="text-2xl font-light text-white">{task.title}</h2>
            <div className="text-8xl font-thin tracking-widest text-white tabular-nums">
              {formatTime(time)}
            </div>
            <div className="flex items-center justify-center gap-8">
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className="text-gray-400 hover:text-white transition uppercase tracking-widest text-sm"
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button 
                onClick={handleEnd}
                className="text-gray-400 hover:text-white transition uppercase tracking-widest text-sm"
              >
                End
              </button>
            </div>
          </div>
        )}

        {showCompletion && !showReflection && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-300 w-full px-8 max-w-sm">
            <h2 className="text-2xl font-light text-white">Did you finish?</h2>
            <div className="flex flex-col gap-4 w-full">
              <button 
                onClick={handleYes}
                className="py-3 px-6 bg-white text-black rounded uppercase tracking-widest text-sm font-medium hover:bg-gray-200 transition"
              >
                Yes
              </button>
              <button 
                onClick={handleContinue}
                className="py-3 px-6 border border-gray-800 text-white rounded uppercase tracking-widest text-sm hover:bg-gray-900 transition"
              >
                Continue
              </button>
              <button 
                onClick={handleSkip}
                className="py-3 px-6 text-gray-500 hover:text-white rounded uppercase tracking-widest text-sm transition"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {showReflection && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-300 w-full px-8 max-w-sm">
            <h2 className="text-xl font-light text-white">Why didn&apos;t you do it?</h2>
            <textarea
              autoFocus
              value={reflectionInput}
              onChange={(e) => setReflectionInput(e.target.value)}
              className="w-full bg-transparent border-b border-gray-800 text-white px-2 py-2 focus:outline-none focus:border-white resize-none transition min-h-[100px]"
              placeholder="Be honest..."
            />
            <button 
              onClick={submitReflection}
              className="w-full py-3 bg-white text-black rounded uppercase tracking-widest text-sm font-medium hover:bg-gray-200 transition"
            >
              Submit
            </button>
          </div>
        )}
        
        {/* Manual closure without save */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-600 hover:text-white transition"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  );
}
