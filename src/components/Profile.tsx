import { useAuth } from "@/src/lib/AuthContext";
import { Card, Button } from "./ui";
import { 
  User, 
  Mail, 
  Fingerprint, 
  ShieldCheck, 
  Settings, 
  Activity, 
  LogOut,
  MapPin,
  Briefcase,
  Star,
  Zap,
  Globe,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";
import { motion } from "motion/react";

export const Profile = () => {
  const { user, logout } = useAuth();

  const stats = [
    { label: "Neural Clarity", value: "94%", icon: Zap, color: "text-amber-400" },
    { label: "Sync Status", value: "Active", icon: Activity, color: "text-emerald-400" },
    { label: "Trust Rank", value: "Elite", icon: Star, color: "text-indigo-400" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      <header className="flex flex-col md:flex-row items-center gap-8 p-8 glass-panel-heavy rounded-[3rem] relative overflow-hidden">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-white/10 bg-white/5 flex items-center justify-center overflow-hidden ring-4 ring-indigo-500/20">
            <User className="w-16 h-16 text-slate-400" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-[#020617] flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-white">{user?.name}</h1>
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 w-fit">Verified Entity</span>
          </div>
          <p className="text-slate-400 font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
            <Mail className="w-4 h-4" /> {user?.email}
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-2">
              <Settings className="w-4 h-4" /> Edit Core Profile
            </Button>
            <Button variant="ghost" size="sm" className="rounded-xl flex items-center gap-2 text-rose-400 hover:bg-rose-500/10" onClick={logout}>
              <LogOut className="w-4 h-4" /> Terminate Session
            </Button>
          </div>
        </div>

        {/* Decorative System ID */}
        <div className="absolute top-8 right-8 text-right hidden lg:block">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">System Identifier</p>
          <p className="text-xs font-mono text-indigo-400/50 uppercase">{user?.id}</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="space-y-8">
          <Card className="glass-panel p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 border-b border-white/5 pb-4">Personal Metadata</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Location</p>
                  <p className="text-sm font-bold text-slate-200">Global Citizen / Remote</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Primary Domain</p>
                  <p className="text-sm font-bold text-slate-200">Neural Engineering</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Interface Language</p>
                  <p className="text-sm font-bold text-slate-200">English (Neural Optimized)</p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Connected Nodes</h4>
               <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5 text-slate-400 hover:text-white">
                    <Github className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5 text-slate-400 hover:text-white">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5 text-slate-400 hover:text-white">
                    <Twitter className="w-5 h-5" />
                  </button>
               </div>
            </div>
          </Card>

          <Card className="glass-panel p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Fingerprint className="w-6 h-6 text-indigo-400" />
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Security Protocol</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Your identity is protected by Nexor's 256-bit neural encryption. 
              Last sync: {new Date().toLocaleDateString()}
            </p>
            <Button className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-indigo-500/30 rounded-xl text-xs font-bold py-2">Rotate Access Keys</Button>
          </Card>
        </div>

        {/* Right Column: Stats and Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-[2rem] flex flex-col items-center text-center group hover:bg-white/5 transition-colors border border-white/5"
              >
                <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <Card className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden min-h-[300px]">
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
               <Activity className="w-4 h-4" /> Neural Activity Feed
             </h3>
             
             <div className="space-y-6">
                {[
                  { title: "Profile Analysis Sync", detail: "88% completion achieved", time: "2 hours ago", color: "bg-emerald-500" },
                  { title: "Skill Matrix Update", detail: "Added 'Generative AI' to core skills", time: "5 hours ago", color: "bg-indigo-500" },
                  { title: "Security Audit", detail: "Successfully verified from new node", time: "Yesterday", color: "bg-amber-500" },
                  { title: "Resume Intelligence", detail: "PDF extraction completed", time: "2 days ago", color: "bg-purple-500" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${item.color} shadow-lg shadow-${item.color.split('-')[1]}-500/50 mt-1.5`} />
                      {i !== 3 && <div className="w-0.5 h-full bg-white/5 my-1" />}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-slate-200">{item.title}</h4>
                        <span className="text-[9px] font-bold text-slate-600 uppercase">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{item.detail}</p>
                    </div>
                  </div>
                ))}
             </div>

             {/* Decorative Background Mesh */}
             <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />
          </Card>
        </div>
      </div>
    </div>
  );
};
