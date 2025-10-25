import NavBar from "@/components/bars/NavBar";
import { SideBar } from "@/components/bars/SideBar";

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
