
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { dashboard, budget, analytics, profile, signOut } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: dashboard },
  { name: "Budget", href: "/budget", icon: budget },
  { name: "Analytics", href: "/analytics", icon: analytics },
  { name: "Profile", href: "/profile", icon: profile },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut: authSignOut } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <Sidebar className="bg-white border-r border-gray-200 shadow-lg min-w-[220px] max-w-xs">
      <SidebarContent>
        {/* Logo Section */}
        <div className="flex items-center space-x-2 mt-6 mb-6 ml-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
            {/* Main FinTrack icon */}
            <budget className="w-6 h-6 text-white" />
          </div>
          <span className="ml-2 text-2xl font-bold text-gray-900 font-sans tracking-tight">FinTrack</span>
        </div>
        {/* Navigation Card */}
        <SidebarGroup>
          <SidebarGroupContent className="bg-gray-50 rounded-xl shadow p-2 mx-3">
            <SidebarMenu>
              {navItems.map(item => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className={`transition-colors ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-blue-200 to-purple-100 text-blue-800"
                        : "text-gray-800 hover:bg-gray-100"
                    }`}
                    onClick={() => navigate(item.href)}
                  >
                    <button type="button" className="flex items-center w-full">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Sign Out */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={async () => {
                    await authSignOut();
                    navigate("/auth");
                  }}
                >
                  <button type="button" className="flex items-center w-full">
                    <signOut className="w-5 h-5 mr-3" />
                    <span>Sign Out</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
