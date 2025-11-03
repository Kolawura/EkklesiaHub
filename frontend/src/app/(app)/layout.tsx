import { NavBar } from "@/components/layouts/NavBar";
import { LeftSidebar } from "@/components/layouts/leftSideBar";
import { Sidebar } from "@/components/Home/components/sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <NavBar />
      <div className="flex overflow-auto">
        <LeftSidebar />
        <div className="flex-1 flex flex-col px-6 overflow-y-auto">
          <div className="flex gap-6 justify-evenly mx-auto py-8 w-full">
            {children}
            <aside className="w-80 hidden lg:block">
              <Sidebar />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
