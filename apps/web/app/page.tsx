"use client";
import { Logo } from "apps/web/app/components/common";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-gray-800">
      <main className="flex-1 pt-20 pb-10 overflow-y-auto w-full max-w-xl mx-auto">
        {/* Hero */}
        <section className="flex flex-col items-center text-center min-h-[60vh] justify-center px-4">
          <div className="mb-4">
            <Logo />
          </div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-4xl font-light tracking-tight mb-4 leading-tight"
          >
            Calm Execution.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
            className="text-gray-400 max-w-sm mb-12 text-sm"
          >
            Focus purely on what matters — a minimal workspace driven by intelligent execution.
          </motion.p>
          
          <Link href="/auth" className="w-full flex justify-center">
            <motion.button
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 border border-white text-black bg-white hover:bg-gray-200 transition text-sm font-medium uppercase tracking-widest rounded-sm"
            >
              Get Started
            </motion.button>
          </Link>
        </section>
        
        {/* Features */}
        <section className="py-12 px-4 space-y-12 max-w-sm mx-auto">
          {[
            { title: "Clarity", text: "A serene, distraction-free environment." },
            { title: "Execution", text: "Actions prioritized deliberately without friction." },
            { title: "Flow", text: "Endless scrolling replaced with decisive timers." },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center"
            >
              <h3 className="text-base font-medium mb-1 tracking-wide">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.text}</p>
            </motion.div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-12 text-center text-gray-700 text-xs font-mono uppercase tracking-widest"
      >
        © 2026 ZENITH APP
      </motion.footer>
    </div>
  );
}
