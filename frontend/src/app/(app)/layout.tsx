import NavBar from "@/components/bars/NavBar";
import { SideBar } from "@/components/bars/SideBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-parchment">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
