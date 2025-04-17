
import React from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "../sidebar/AppSidebar";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { state } = useSidebar();

  const mainClasses = [
    "flex-1 relative",
    "p-6 overflow-auto bg-gray-50",
    state === "collapsed" ? "w-full flex-grow" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className={mainClasses}>
      {children}
    </main>
  );
};

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-hidden flex-grow">
        <AppSidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
