"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "../components/common";
import { User, ArrowRight } from "lucide-react";
import { apiFetch } from "../lib/api";
import { Task, Plan } from "@zenith/types";
import { FocusMode } from "./components/FocusMode";
import { CreatePlanModal } from "./components/CreatePlanModal";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [errorToast, setErrorToast] = useState("");
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);

  const fetchDashboard = async () => {
    try {
      const [todayRes, nextRes, plansRes] = await Promise.all([
        apiFetch("/tasks/today"),
        apiFetch("/tasks/next"),
        apiFetch("/plan")
      ]);

      setSummary(todayRes.data?.summary || null);
      setCurrentTask(nextRes.data?.task || null);
      setPlans(plansRes.data || []);
    } catch (err) {
      console.error(err);
      setErrorToast("Failed to fetch dashboard data.");
      setTimeout(() => setErrorToast(""), 3000);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  if (loading || !user) {
    return <div className="min-h-screen bg-black text-gray-400 flex items-center justify-center font-mono text-sm tracking-widest uppercase selection:bg-[#333]">Loading</div>;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-black text-[#e5e5e5] flex flex-col relative font-sans selection:bg-[#333]">
      
      {errorToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black border border-red-900/50 text-red-500 px-6 py-2 shadow-2xl text-xs tracking-wide z-50">
          {errorToast}
        </div>
      )}

      {/* Navigation */}
      <header className="w-full px-6 py-8 flex justify-between items-center z-20 sticky top-0 bg-black/80 backdrop-blur-md">
        <Logo />
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-gray-500 hover:text-white transition text-xs font-mono tracking-widest uppercase"
          >
            + New Plan
          </button>
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white transition outline-none"
            >
              <User size={16} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-10 mt-2 w-48 bg-black border border-[#1a1a1a] shadow-2xl z-30">
                <div className="px-4 py-3 border-b border-[#1a1a1a] mb-1">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-[#111] transition"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto px-6 py-8 pb-32">
        {isFetching ? (
          <div className="flex text-gray-600 font-mono text-xs uppercase tracking-widest pt-10">Syncing system state...</div>
        ) : (
          <div className="space-y-16 animate-in fade-in duration-700">
            
            {/* 1. Overview */}
            <section className="space-y-2 border-l border-[#333] pl-5 py-1">
               {summary ? (
                 <div className="flex flex-col gap-1 font-mono text-xs tracking-wide text-gray-400">
                   <p className="text-[#888]">{summary.completed}/{summary.total} tasks done today</p>
                   <p className="text-[#888]">{Math.max(summary.totalPomodoros - summary.completedPomodoros, 0)} pending chunks</p>
                 </div>
               ) : (
                 <p className="font-mono text-xs tracking-wide text-gray-600">System idle.</p>
               )}
            </section>

            {/* 2. Next Action Engine */}
            <section className="space-y-4">
              <h2 className="text-[10px] font-mono tracking-[0.2em] text-[#666] uppercase mb-6 flex items-center gap-3">
                Next Action <span className="h-px bg-[#222] flex-1"></span>
              </h2>
              
              {currentTask ? (
                <div className="group relative block p-6 sm:p-8 border border-[#222] hover:border-[#444] transition-all duration-500 bg-gradient-to-b from-[#050505] to-black">
                  <div className="flex justify-between items-start gap-4">
                     <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs font-mono text-gray-500 uppercase tracking-widest">
                           {currentTask.planId && plans.find(p => p.id === currentTask.planId) ? (
                             <span className="text-indigo-400/70">{plans.find(p => p.id === currentTask.planId)?.title}</span>
                           ) : <span>Inbox</span>}
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-light tracking-tight text-white leading-snug">
                          {currentTask.title}
                        </h3>
                        
                        <div className="flex items-center gap-3 text-xs font-mono text-[#555] pt-2">
                           <span className={currentTask.skipCount > 2 ? "text-amber-500/70" : ""}>
                             {Math.max(currentTask.estimatedPomodoros - currentTask.completedPomodoros, 1)} bursts remaining
                           </span>
                        </div>
                     </div>
                     
                     <button 
                       onClick={() => setFocusMode(true)}
                       className="shrink-0 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 hover:bg-indigo-100 transition duration-300 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                     >
                        <ArrowRight size={20} className="ml-0.5" strokeWidth={2} />
                     </button>
                  </div>

                  {currentTask.skipCount > 0 && (
                     <div className="absolute -bottom-2.5 right-6 bg-black border border-[#222] px-3 py-1 text-[10px] font-mono text-[#666] uppercase tracking-widest shadow-lg">
                        avoided {currentTask.skipCount}x
                     </div>
                  )}
                </div>
              ) : (
                <div className="p-8 border justify-center border-dashed border-[#222] text-sm text-gray-500 flex items-center bg-[#050505]/50">
                  <p className="font-mono text-xs uppercase tracking-widest">No target acquired. <button onClick={() => setIsModalOpen(true)} className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition ml-1">Generate Plan</button>.</p>
                </div>
              )}
            </section>

            {/* 3. Plans List */}
            <section className="space-y-4 pt-4">
               <h2 className="text-[10px] font-mono tracking-[0.2em] text-[#666] uppercase mb-4 flex items-center gap-3">
                Active Architecture <span className="h-px bg-[#222] flex-1"></span>
              </h2>
              
              {plans.length > 0 ? (
                <div className="flex flex-col border border-[#111] bg-[#020202]">
                   {plans.map((plan, i) => (
                     <Link 
                       key={plan.id} 
                       href={`/plan/${plan.id}`}
                       className={`flex items-center justify-between p-4 hover:px-5 hover:bg-[#0a0a0a] transition-all duration-300 group ${i !== plans.length - 1 ? 'border-b border-[#0a0a0a]' : ''}`}
                     >
                       <span className="text-sm font-medium tracking-wide text-gray-400 group-hover:text-white transition truncate pr-4">
                         {plan.title || "Untitled Plan"}
                       </span>
                       
                       <div className="flex items-center gap-4 shrink-0 font-mono text-[10px] uppercase tracking-widest text-[#555]">
                         <span className="group-hover:text-gray-400 transition ml-2 tracking-wide opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 duration-300">
                           Execute
                         </span>
                         {/* Deep blue/violet Zenith accent dot */}
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/80 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                       </div>
                     </Link>
                   ))}
                </div>
              ) : (
                <p className="text-[10px] text-[#444] font-mono uppercase tracking-widest pl-2">System idle.</p>
              )}
            </section>

          </div>
        )}
      </main>

      {focusMode && currentTask && (
        <FocusMode 
          task={currentTask} 
          onClose={() => setFocusMode(false)}
          onComplete={async () => {
            setFocusMode(false);
            await fetchDashboard();
          }}
          onSkip={async () => {
            setFocusMode(false);
            await fetchDashboard();
          }}
        />
      )}

      <CreatePlanModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPlanCreated={fetchDashboard}
      />
    </div>
  );
}
