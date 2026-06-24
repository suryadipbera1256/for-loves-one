"use client";

import { AdminProvider } from "@/lib/admin/store";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Admin segment layout. Wraps every /admin route in the content store + chrome.
 * Kept separate from the public layout so the dashboard never affects the site.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
