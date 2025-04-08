
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Calendar, 
  FileText, 
  Truck, 
  Map, 
  Settings,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4">
        <img src="/lovable-uploads/ee3afa94-db6f-423a-9107-87613e9dc585.png" alt="CVK Diagnostics" className="h-10" />
        <span className="ml-2 font-bold text-lg">CVK Diagnostics</span>
      </SidebarHeader>
      <SidebarTrigger className="absolute right-2 top-4 lg:hidden" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/registration">
                    <FileText className="h-5 w-5" />
                    <span>Registration</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/appointments">
                    <Calendar className="h-5 w-5" />
                    <span>Appointments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/b2b-collection">
                    <Truck className="h-5 w-5" />
                    <span>B2B Collection</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/trip-management">
                        <Map className="h-5 w-5" />
                        <span>Trip Management</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/home-collection">
                    <Users className="h-5 w-5" />
                    <span>Home Collection</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenuButton asChild>
          <Link to="/settings">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
