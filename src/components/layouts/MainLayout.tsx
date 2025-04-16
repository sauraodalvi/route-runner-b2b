
import React from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "../sidebar/AppSidebar";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../ui/button";

const MainContent = ({ children }: { children: React.ReactNode }) => {
  const { state } = useSidebar();
  const [isMaximized, setIsMaximized] = React.useState(false);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const mainClasses = [
    "flex-1 relative",
    "p-6 overflow-auto bg-gray-50 w-full",
    state === "collapsed" && isMaximized && "absolute inset-0 z-50",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className={mainClasses}>
      {state === "collapsed" && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-50"
          onClick={toggleMaximize}
        >
          {isMaximized ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      )}
      {children}
    </main>
  );
};

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
