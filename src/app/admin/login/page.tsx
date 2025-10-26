import AdminLoginPageClient from "./AdminLoginPageClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default function AdminLoginPage() {
  return <AdminLoginPageClient />;
}

