import "@/app/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Admin Panel | SoulMatch",
  description:
    "Kelola admin dan konten SoulMatch melalui panel superadmin dan admin.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-900 text-slate-100">{children}</div>;
}
