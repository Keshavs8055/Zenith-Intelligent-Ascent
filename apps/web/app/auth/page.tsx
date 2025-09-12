"use client";

import { useState } from "react";
import Head from "next/head";
import { Logo } from "../components/common";
import AuthTabs from "./components/tabs";
import LoginForm from "./components/loginForm";
import SignupForm from "./components/signupForm";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");

  return (
    <>
      <Head>
        <title>Zenith – Login or Sign Up</title>
        <meta
          name="description"
          content="Login or create your account to start your journey with Zenith – your calm and motivating personal growth app."
        />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-gray-100 px-4 relative overflow-hidden">
        {/* Floating logo */}
        <div className="absolute top-6 w-full text-center text-2xl font-bold">
          <Logo />
        </div>

        {/* Tabs */}
        <div className="w-full max-w-sm mb-6">
          <AuthTabs
            tab={tab}
            setTab={setTab}
          />
        </div>

        {/* Forms */}
        <div className="w-full max-w-sm">
          {tab === "login" && <LoginForm />}
          {tab === "signup" && <SignupForm />}
        </div>
      </div>
    </>
  );
}
