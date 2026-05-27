import { useState } from "react";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";

import { NexorLogo } from "./components/NexorLogo";

function AppContent() {
  const { user, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#020617]">
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="w-16 h-16">
            <NexorLogo variant="icon" className="w-full h-full" />
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Initializing Neural Link</div>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showAuth) return <AuthPage onBack={() => setShowAuth(false)} />;
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
