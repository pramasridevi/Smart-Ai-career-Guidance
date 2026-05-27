import React, { useState } from "react";
import { Button, Card, Input } from "@/src/components/ui";
import { Compass, Loader2 } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";
import { motion } from "framer-motion";

import { NexorLogo } from "./NexorLogo";

export const AuthPage = ({ onBack }: { onBack: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Mesh Gradient Backgrounds */}
      <div className="mesh-gradient-1"></div>
      <div className="mesh-gradient-2"></div>
      <div className="mesh-gradient-3"></div>

      <div className="w-full max-md relative z-10">
        <div className="flex flex-col items-center mb-10 gap-2">
          <Button variant="ghost" size="sm" className="self-start mb-4 text-slate-400 hover:text-white" onClick={onBack}>&larr; Return to Core</Button>
          <div className="w-12 h-12">
            <NexorLogo variant="icon" className="w-full h-full" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">NEXOR AI</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Neural Career Processing</p>
        </div>
        
        <Card className="glass-panel-heavy p-10 rounded-[2.5rem] border-white/10 ring-1 ring-white/5">
          <h2 className="text-xl font-bold mb-8 tracking-tight text-center text-slate-200">{isLogin ? "Neural Sync Login" : "Initialize New Profile"}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Integrity Name</label>
                <Input placeholder="Alex Sterling" value={name} onChange={(e: any) => setName(e.target.value)} required />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Network Identity (Email)</label>
              <Input type="email" placeholder="identity@orizon.ai" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Cipher Key (Password)</label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} required />
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase tracking-wider text-center"
              >
                Sync Error: {error}
              </motion.div>
            )}
            
            <Button type="submit" className="w-full h-14 rounded-2xl mt-4" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Synchronize" : "Initialize")}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <button 
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Request New Identity Profile →" : "Synchronize Existing Profile →"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
