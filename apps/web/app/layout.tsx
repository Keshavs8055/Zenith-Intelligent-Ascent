import "./styles/globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "Zenith Planner",
  description: "AI-powered planning at your fingertips",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
