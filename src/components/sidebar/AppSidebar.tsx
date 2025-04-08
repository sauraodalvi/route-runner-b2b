
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Calendar, 
  FileText, 
  Truck, 
  Map, 
  Settings,
  Users,
  Search,
  CreditCard,
  FileSpreadsheet,
  History,
  ClipboardList,
  List,
  Activity,
  HelpCircle
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
                  <Link to="/registration-billing">
                    <CreditCard className="h-5 w-5" />
                    <span>Registration / Billing</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/patient-search">
                    <Search className="h-5 w-5" />
                    <span>Patient Search</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/assign-cards">
                    <CreditCard className="h-5 w-5" />
                    <span>Assign Cards</span>
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
                  <Link to="/home-collection">
                    <Users className="h-5 w-5" />
                    <span>Home Collection</span>
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
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link to="/trip-management">
                        <Map className="h-5 w-5" />
                        <span>Trip Management</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/billing-history">
                    <History className="h-5 w-5" />
                    <span>Billing History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/consent-history">
                    <ClipboardList className="h-5 w-5" />
                    <span>Consent History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/lab-form-values">
                    <FileText className="h-5 w-5" />
                    <span>Lab Form Values</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/financial-reports">
                    <FileSpreadsheet className="h-5 w-5" />
                    <span>Financial Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/archives">
                    <FileText className="h-5 w-5" />
                    <span>Archives</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/report-prints">
                    <FileText className="h-5 w-5" />
                    <span>Report Prints</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/collection-reports">
                    <FileSpreadsheet className="h-5 w-5" />
                    <span>Collection Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/tests-list">
                    <List className="h-5 w-5" />
                    <span>Tests List</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/operational-status">
                    <Activity className="h-5 w-5" />
                    <span>Operational Status</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/advanced-search">
                    <Search className="h-5 w-5" />
                    <span>Advanced Search</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenuButton asChild>
          <Link to="/updates">
            <Activity className="h-5 w-5" />
            <span>Updates</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton asChild className="mt-2">
          <Link to="/video-tutorial">
            <HelpCircle className="h-5 w-5" />
            <span>Video Tutorial</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton asChild className="mt-2">
          <Link to="/support">
            <Settings className="h-5 w-5" />
            <span>Support</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
