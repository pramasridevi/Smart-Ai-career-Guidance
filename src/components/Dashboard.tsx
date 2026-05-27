import { useState } from "react";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Target, 
  Heart, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  User as UserIcon,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";
import { Button } from "./ui";
import { JobGuidance } from "./JobGuidance";
import { ExamPrep } from "./ExamPrep";
import { PassionSupport } from "./PassionSupport";
import { Overview } from "./Overview";

import { NexorLogo } from "./NexorLogo";

import { Profile } from "./Profile";

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "jobs", label: "Job Guidance", icon: GraduationCap },
    { id: "exams", label: "Exam Prep", icon: Target },
    { id: "passion", label: "Passion Support", icon: Heart },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <Overview onNavigate={setActiveTab} />;
      case "jobs": return <JobGuidance />;
      case "resume": return <JobGuidance />; // Resume navigation points to JobGuidance
      case "exams": return <ExamPrep />;
      case "passion": return <PassionSupport />;
      case "profile": return <Profile />;
      default: return <Overview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 font-sans relative overflow-hidden">
      {/* Mesh Gradient Backgrounds */}
      <div className="mesh-gradient-1"></div>
      <div className="mesh-gradient-2"></div>
      <div className="mesh-gradient-3"></div>

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0"} 
        flex-shrink-0 transition-all duration-300 overflow-hidden z-50
      `}>
        <div className="w-64 flex flex-col gap-4 p-6 h-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 flex items-center justify-center">
            <NexorLogo variant="icon" className="w-full h-full" />
          </div>
          {isSidebarOpen && <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">NEXOR AI</span>}
        </div>

        <div className="glass-panel-heavy rounded-2xl p-4 flex-1 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-4 font-bold">Main Domains</p>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm
                  ${activeTab === item.id 
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" 
                    : "text-slate-400 hover:bg-white/5"}
                `}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span className="font-medium truncate">{item.label}</span>}
              </button>
            ))}
          </nav>

          {isSidebarOpen && (
            <div className="mt-8 border-t border-white/5 pt-8">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-4 font-bold">Analysis Status</p>
              <div className="space-y-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-[10px] font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-400 bg-emerald-400/10">Profile Sync</span>
                    <span className="text-[10px] font-semibold inline-block text-emerald-400">88%</span>
                  </div>
                  <div className="overflow-hidden h-1.5 flex rounded-full bg-white/5">
                    <div style={{width:'88%'}} className="bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-slate-400 mb-1 font-medium">Market Probability</p>
                  <p className="text-lg font-bold text-white tracking-tight">High Match</p>
                  <p className="text-[10px] text-indigo-400 font-medium">Ready for 2026 Roles</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Card */}
        {isSidebarOpen && (
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-4 shadow-lg ring-1 ring-white/20">
            <p className="text-xs font-bold mb-1 text-white">AI Assistant</p>
            <p className="text-[10px] text-indigo-100 leading-relaxed mb-3">Your profile analysis is ready. Focus on Cloud Architecture this week.</p>
            <button className="w-full py-2 bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-white/30 text-white transition-colors">Ask Orizon</button>
          </div>
        )}

        <div className="p-2 border-t border-white/5">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-bold uppercase tracking-wider"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden z-10">
        {/* Top Header */}
        <header className="h-16 bg-white/5 backdrop-blur-md border-b border-white/10 px-8 flex items-center justify-between z-40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
              {activeTab !== "overview" && (
                <button 
                  onClick={() => setActiveTab("overview")}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
                  title="Go Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full w-64 ring-0 focus-within:ring-1 focus-within:ring-white/20 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input type="text" placeholder="Search roadmap..." className="bg-transparent border-none text-xs w-full focus:outline-none text-slate-300" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div 
              onClick={() => setActiveTab("profile")}
              className="flex flex-col items-end mr-2 cursor-pointer group"
            >
              <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">{user?.name}</span>
              <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-tighter">System ID: {user?.id.slice(-6)}</span>
            </div>
            <div 
              onClick={() => setActiveTab("profile")}
              className={`
                w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden transition-colors cursor-pointer
                ${activeTab === "profile" ? "border-emerald-500 bg-emerald-500/10" : "border-white/20 bg-white/10 hover:border-emerald-500/50"}
              `}
            >
              <UserIcon className={`w-5 h-5 ${activeTab === "profile" ? "text-emerald-400" : "text-slate-400"}`} />
            </div>
            <button className="relative p-2 hover:bg-white/5 rounded-lg transition-all text-slate-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {renderContent()}
        </div>

        {/* Status Bar */}
        <footer className="h-8 bg-white/5 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-8 text-[10px] text-slate-500 font-medium">
          <div className="flex gap-6">
            <span>AI Core: v4.2-Neural</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div> System Sync Active</span>
          </div>
          <div className="flex gap-4">
            <span>© 2026 NEXOR</span>
            <a href="#" className="hover:text-white transition-colors">Neural Processing Unit</a>
          </div>
        </footer>
      </main>
    </div>
  );
};
