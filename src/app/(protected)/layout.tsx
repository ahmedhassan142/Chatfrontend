// app/(protected)/layout.tsx
"use client";

import { AuthProvider } from "@/app/context/authContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}