"use client";
import { Logo } from "apps/web/app/components/common";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-100 flex flex-col">
      {/* Scrollable content */}
      <main className="flex-1 pt-20 pb-10 overflow-y-auto">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center px-4 text-center min-h-[80vh]">
          <div className="mb-2 text-3xl md:text-5xl">
            <Logo />
          </div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-3xl md:text-5xl font-light tracking-tight mb-4 leading-tight"
          >
            Calm Productivity
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
            className="text-gray-400 max-w-sm md:max-w-md mb-8 text-sm md:text-base"
          >
            Focus on what matters — a minimal workspace powered by AI.
          </motion.p>
          <Link
            href="/auth"
            className="w-full flex justify-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px rgba(99,102,241,0.6)",
              }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-3 rounded-2xl bg-indigo-600/80 hover:bg-indigo-600 transition text-sm md:text-base"
            >
              Get Started
            </motion.button>
          </Link>
        </section>
        {/* Features */}
        <section
          id="features"
          className="py-12 px-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto"
        >
          {[
            { title: "Clarity", text: "A serene, distraction-free design." },
            {
              title: "AI Collaboration",
              text: "Quietly assist your progress.",
            },
            { title: "Flow", text: "Align tasks, routines, and goals." },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-5 rounded-2xl bg-white/5 border border-gray-800 backdrop-blur-md text-left"
            >
              <h3 className="text-lg font-medium mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.text}</p>
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
        className="py-6 text-center text-gray-600 text-xs md:text-sm border-t border-gray-900"
      >
        © 2025 Zenith
      </motion.footer>
    </div>
  );
}
