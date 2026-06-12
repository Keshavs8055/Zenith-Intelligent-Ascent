"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "../../components/common";
import { ArrowLeft, CheckCircle2, Circle, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { apiFetch } from "../../lib/api";
import { Task, Plan } from "@zenith/types";
import Link from "next/link";
import { FocusMode } from "../../dashboard/components/FocusMode";

export default function PlanPage() {
  const { id: planId } = useParams() as { id: string };
  const { user, loading } = useAuth();
  const router = useRouter();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [errorToast, setErrorToast] = useState("");
  
  // UI states
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskEstimate, setNewTaskEstimate] = useState("1");
  const [showCompleted, setShowCompleted] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [focusTask, setFocusTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);

  const fetchData = async () => {
    if (!planId) return;
    try {
      // In a real app we'd fetch GET /plans/:id and GET /plans/:id/tasks
      // Assuming API supports this based on architecture spec
      const [planRes, tasksRes] = await Promise.all([
        apiFetch(`/plans/${planId}`),
        apiFetch(`/plans/${planId}/tasks`)
      ]);
      setPlan(planRes.data);
      setTasks(tasksRes.data || []);
    } catch (err) {
      console.error(err);
      setErrorToast("Failed to sync plan data.");
      setTimeout(() => setErrorToast(""), 3000);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user && planId) {
      fetchData();
    }
  }, [user, planId]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await apiFetch(`/tasks`, {
        method: "POST",
        body: JSON.stringify({
          title: newTaskTitle,
          planId,
          estimatedPomodoros: parseInt(newTaskEstimate) || 1,
          dueDate: new Date().toISOString() // assign to today by default
        })
      });
      setNewTaskTitle("");
      setNewTaskEstimate("1");
      await fetchData();
    } catch (err) {
      setErrorToast("Failed to create task.");
      setTimeout(() => setErrorToast(""), 3000);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      await apiFetch(`/tasks/${task.id}/progress`, {
        method: "PATCH",
        body: JSON.stringify({ action: "complete_task" })
      });
      fetchData();
    } catch (err) {
      setErrorToast("Failed to update task.");
      setTimeout(() => setErrorToast(""), 3000);
    }
  };

  if (loading || isFetching || !user) {
    return <div className="min-h-screen bg-black text-gray-400 flex items-center justify-center font-mono text-sm tracking-widest uppercase selection:bg-[#333]">Loading</div>;
  }

  if (!plan) {
    return <div className="min-h-screen bg-black text-[#e5e5e5] p-6 text-center pt-32 font-mono">Plan not found</div>;
  }

  // Derived state
  const isToday = (d?: string) => {
    if (!d) return false;
    const date = new Date(d);
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };
  
  const isFuture = (d?: string) => {
    if (!d) return false;
    const date = new Date(d);
    date.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    return date > today;
  };

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  
  const todayTasks = pendingTasks.filter(t => isToday(t.date) || isToday(t.dueDate) || (!t.date && !t.dueDate));
  const upcomingTasks = pendingTasks.filter(t => isFuture(t.date) || isFuture(t.dueDate));

  // Progress calc
  const total = tasks.length;
  const comp = completedTasks.length;
  const progressPercent = total === 0 ? 0 : Math.round((comp / total) * 100);

  return (
    <div className="min-h-screen bg-black text-[#e5e5e5] flex flex-col relative font-sans selection:bg-[#333]">
      
      {errorToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black border border-red-900/50 text-red-500 px-6 py-2 shadow-2xl text-xs tracking-wide z-50">
          {errorToast}
        </div>
      )}

      {/* Navigation */}
      <header className="w-full px-6 py-6 flex items-center gap-4 z-20 sticky top-0 bg-black/80 backdrop-blur-md">
        <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white transition rounded cursor-pointer">
          <ArrowLeft size={18} />
        </Link>
        <Logo />
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto px-6 py-4 pb-32 space-y-12 animate-in fade-in duration-500">
        
        {/* 1. Plan Header */}
        <section className="space-y-4">
           <div className="flex items-end justify-between gap-4">
             <h1 className="text-3xl font-light tracking-tight text-white">{plan.title}</h1>
             <span className="text-xs font-mono text-gray-500 pb-1">{progressPercent}%</span>
           </div>
           {/* Minimal visual identity - thin progress line */}
           <div className="w-full h-[1px] bg-[#222]">
             <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
           </div>
        </section>

        {/* 5. Add Task (Inline) */}
        <section>
          <form onSubmit={handleAddTask} className="flex items-center gap-3 bg-[#050505] border border-[#222] focus-within:border-[#555] transition p-2 px-3">
             <Plus size={16} className="text-gray-500" />
             <input 
               type="text"
               value={newTaskTitle}
               onChange={e => setNewTaskTitle(e.target.value)}
               placeholder="Add tactical objective..."
               className="flex-1 bg-transparent border-none text-sm text-white placeholder-gray-600 focus:outline-none"
             />
             <div className="flex items-center gap-2 border-l border-[#222] pl-3">
               <span className="text-[10px] font-mono text-gray-500">CHUNKS</span>
               <input 
                 type="number"
                 min="1" max="10"
                 value={newTaskEstimate}
                 onChange={e => setNewTaskEstimate(e.target.value)}
                 className="w-10 bg-transparent text-white font-mono text-sm text-center focus:outline-none placeholder-gray-700"
               />
             </div>
             <button type="submit" className="hidden" />
          </form>
        </section>

        {/* 2. Today's Tasks */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-mono tracking-[0.2em] text-indigo-400/80 uppercase">Active Focus</h2>
          {todayTasks.length > 0 ? (
            <div className="space-y-2 relative">
               {/* Line segment connecting active tasks visually */}
               <div className="absolute left-3.5 top-5 bottom-4 w-px bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none" />
               
               {todayTasks.map((task, idx) => (
                 <div key={task.id} className={`flex items-start gap-4 p-3 group border border-transparent transition hover:border-[#1a1a1a] ${idx === 0 ? 'bg-[#0a0a0a] border border-[#1a1a1a]' : ''}`}>
                   <button 
                     onClick={() => toggleTask(task)} 
                     className="mt-0.5 z-10 shrink-0 text-gray-600 hover:text-white transition bg-black rounded-full"
                   >
                     <Circle size={20} strokeWidth={1.5} />
                   </button>
                   <div className="flex-1 min-w-0 pr-4">
                     <p className={`text-sm tracking-wide ${idx === 0 ? "text-white" : "text-gray-300"}`}>
                       {task.title}
                     </p>
                     <div className="flex items-center gap-3 mt-1.5 font-mono text-[10px] uppercase tracking-widest text-[#555]">
                        <span>{Math.max(task.estimatedPomodoros - task.completedPomodoros, 0)} chunks</span>
                        {task.skipCount > 0 && <span className="text-amber-500/50">skipped {task.skipCount}x</span>}
                     </div>
                   </div>
                   {idx === 0 && (
                     <button 
                       onClick={() => setFocusTask(task)}
                       className="shrink-0 self-center text-xs font-mono uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition"
                     >
                       Engage
                     </button>
                   )}
                 </div>
               ))}
            </div>
          ) : (
            <p className="text-xs text-gray-600 font-mono tracking-widest uppercase pl-2 border-l border-[#222]">No active items.</p>
          )}
        </section>

        {/* 3. Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
           <section className="space-y-2 border-t border-[#111] pt-6">
             <button 
               onClick={() => setShowUpcoming(!showUpcoming)}
               className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-[#666] uppercase hover:text-white transition w-full"
             >
               {showUpcoming ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
               Upcoming ({upcomingTasks.length})
             </button>
             
             {showUpcoming && (
                <div className="space-y-1 pt-2 opacity-70">
                   {upcomingTasks.map(task => (
                     <div key={task.id} className="flex items-center gap-4 py-2 px-1 group">
                       <Circle size={16} className="text-[#333]" />
                       <div className="flex-1 flex justify-between items-center pr-2">
                         <span className="text-sm text-gray-500 truncate">{task.title}</span>
                         <span className="text-[10px] font-mono text-[#444] whitespace-nowrap ml-4">
                           {task.date || task.dueDate ? new Date(task.date || task.dueDate!).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : "Later"}
                         </span>
                       </div>
                     </div>
                   ))}
                </div>
             )}
           </section>
        )}

        {/* 4. Completed Tasks */}
        {completedTasks.length > 0 && (
           <section className="space-y-2 border-t border-[#111] pt-6">
             <button 
               onClick={() => setShowCompleted(!showCompleted)}
               className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-[#666] uppercase hover:text-white transition w-full"
             >
               {showCompleted ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
               Completed ({completedTasks.length})
             </button>
             
             {showCompleted && (
                <div className="space-y-1 pt-2">
                   {completedTasks.map(task => (
                     <div key={task.id} className="flex items-start gap-4 py-2 px-1 group opacity-40 hover:opacity-100 transition">
                       <CheckCircle2 size={16} className="text-gray-600 mt-0.5" />
                       <p className="text-sm text-gray-500 line-through">
                         {task.title}
                       </p>
                     </div>
                   ))}
                </div>
             )}
           </section>
        )}

      </main>

      {focusTask && (
        <FocusMode 
          task={focusTask} 
          onClose={() => setFocusTask(null)}
          onComplete={async () => {
            setFocusTask(null);
            await fetchData();
          }}
          onSkip={async () => {
            setFocusTask(null);
            await fetchData();
          }}
        />
      )}
    </div>
  );
}
