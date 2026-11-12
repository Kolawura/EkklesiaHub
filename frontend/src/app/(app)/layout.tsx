import NavBar from "@/components/bars/NavBar";
import { SideBar } from "@/components/bars/SideBar";
import { AuthGuard } from "@/components/auth/AuthGuard";

/*
 * Application shell — every route in this group requires a valid session.
 *   • proxy.ts      → no cookie  ⇒ redirect to /auth
 *   • <AuthGuard>   → cookie present but invalid/expired ⇒ redirect to /auth
 *
 * Layout:
 *   ≥ lg  : persistent sidebar + (navbar over content)
 *   < lg  : no sidebar; navbar shows a menu button that opens a drawer
 *
 * `h-dvh` (dynamic viewport height) instead of `h-screen` so mobile browsers'
 * collapsing address bar doesn't cut off the bottom of the app.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-dvh overflow-hidden bg-parchment">
        <SideBar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <NavBar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
