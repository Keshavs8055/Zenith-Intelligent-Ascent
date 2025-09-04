import "./styles/globals.css";
import type { Metadata } from "next";

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
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
