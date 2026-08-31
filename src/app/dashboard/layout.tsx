import AdminSidebar from "@/components/AdminSidebar";
import RequireAdmin from "@/components/RequireAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAdmin>
      <div className="flex min-h-screen bg-beige">
        <AdminSidebar />
        <main className=" min-w-0 flex-1">{children}</main>
      </div>
    </RequireAdmin>
  );
}
