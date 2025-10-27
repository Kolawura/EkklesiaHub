import NavBar from "@/components/layouts/NavBar";
import { SideBar } from "@/components/layouts/SideBar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <NavBar />
        {children}
      </div>
    </div>
  );
}
