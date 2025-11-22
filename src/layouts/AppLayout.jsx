import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  BarChart2,
  Users,
  KeyRound,
  Settings,
  Activity,
  Layers,
  ClipboardList,
  LogOut,
  Wand2,
  Menu,
  X,
} from "lucide-react";

export default function AppLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const getNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-[#3a3440] to-[#a88fd8] text-white shadow-[0_0_12px_rgba(168,143,216,0.4)]"
        : "text-gray-300 hover:bg-[#2c2533] hover:text-[#d3bff0]"
    }`;

  return (
    <div className="flex h-screen bg-[#0e0e10] text-white overflow-hidden">
      {/* 📱 Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🌙 Sidebar */}
      <aside
        className={`fixed md:static z-40 h-full md:h-auto w-64 bg-gradient-to-b from-[#18121d] via-[#1a1623] to-[#120f18]
          border-r border-white/10 flex flex-col shadow-[0_0_20px_rgba(168,143,216,0.15)]
          transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-64 md:translate-x-0"}`}
      >
        {/* Sidebar scroll content */}
        <div className="flex flex-col flex-1 px-5 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#a88fd8]/40 scrollbar-track-transparent">
          {/* Logo */}
          <div className="flex items-center justify-center mb-3.5 mt-1">
            <img
              src="/advisionlogo.png"
              alt="AdVision Logo"
              className="h-12 w-auto drop-shadow-[0_0_10px_rgba(189,168,200,0.6)] hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => navigate("/app/dashboard")}
            />
          </div>

          {/* Navigation */}
          <ul className="flex flex-col space-y-0.5 flex-1">
            <li>
              <NavLink to="/app/dashboard" className={getNavLinkClass}>
                <LayoutDashboard size={17} /> Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/app/campaigns" className={getNavLinkClass}>
                <Layers size={17} /> Campaigns
              </NavLink>
            </li>

            <li>
              <NavLink to="/app/generator" className={getNavLinkClass}>
                <Wand2 size={17} /> Generator
              </NavLink>
            </li>

            <li>
              <NavLink to="/app/analytics" className={getNavLinkClass}>
                <BarChart2 size={17} /> Analytics
              </NavLink>
            </li>

            <li>
              <NavLink to="/app/ab-testing" className={getNavLinkClass}>
                <Activity size={17} /> A/B Testing
              </NavLink>
            </li>

            <li>
              <NavLink to="/app/api-keys" className={getNavLinkClass}>
                <KeyRound size={17} /> API Keys
              </NavLink>
            </li>

            <li>
              <NavLink to="/app/insights" className={getNavLinkClass}>
                <Users size={17} /> Audience Insights
              </NavLink>
            </li>

            <li>
              <NavLink to="/app/reports" className={getNavLinkClass}>
                <ClipboardList size={17} /> Weekly Reports
              </NavLink>
            </li>

            <li>
              <NavLink to="/app/profile" className={getNavLinkClass}>
                <Settings size={17} /> Profile
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 text-sm rounded-xl 
            bg-[#3a0a0a]/60 hover:bg-[#a22a2a] transition-all font-medium"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* 🌈 MAIN CONTENT */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11]">
        
        {/* Top Bar */}
        <div className="sticky top-0 z-20 flex justify-between items-center px-4 md:px-8 py-4 
        bg-white/5 backdrop-blur-md border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-[#1f1b24] hover:bg-[#2b2533] transition-all"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <h2 className="text-sm md:text-lg font-medium tracking-wide text-[#d7c2f7]">
            Welcome to AdVision Studio
          </h2>

          {/* Top Bar Logout */}
          <button
            onClick={handleLogout}
            className="hidden md:block text-sm px-3 py-1.5 rounded-lg bg-gradient-to-r 
            from-[#3a3440] to-[#a88fd8] hover:brightness-110 shadow-[0_0_12px_rgba(168,143,216,0.3)] transition-all"
          >
            Logout
          </button>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
