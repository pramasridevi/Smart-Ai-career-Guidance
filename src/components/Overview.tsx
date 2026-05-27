import { motion } from "framer-motion";
import { Button } from "./ui";
import { GraduationCap, Target, Heart, FileText, ArrowRight, TrendingUp, Users, Calendar, User } from "lucide-react";
import { useAuth } from "@/src/lib/AuthContext";

export const Overview = ({ onNavigate }: { onNavigate: (tab: string) => void }) => {
  const { user } = useAuth();

  const cards = [
    { 
      id: "jobs", 
      title: "Job Guidance", 
      icon: GraduationCap, 
      color: "bg-blue-500", 
      desc: "Analyze your profile & get job roles.",
      stats: "12 Match Roles"
    },
    { 
      id: "exams", 
      title: "Exam Prep", 
      icon: Target, 
      color: "bg-purple-500", 
      desc: "Get strategic roadmaps for competitive exams.",
      stats: "3 Active Roadmaps"
    },
    { 
      id: "passion", 
      title: "Passion Support", 
      icon: Heart, 
      color: "bg-orange-500", 
      desc: "Switch careers & monetize your hobbies.",
      stats: "New Insights"
    },
    { 
      id: "resume", 
      title: "Resume Analyzer", 
      icon: FileText, 
      color: "bg-green-500", 
      desc: "Optimize your resume with AI suggestions.",
      stats: "Score: 85/100"
    }
  ];

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Hello, {user?.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-400 font-medium">Neural processing complete. Your 2026 trajectory is looking stable.</p>
      </header>

      {/* Hero Widget */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-heavy p-10 rounded-[3rem] relative overflow-hidden"
      >
        <div className="max-w-xl relative z-10">
          <span className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-4 block">Personal Growth Insights</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 leading-[1.1]">
            Global Job Market is <span className="italic font-serif text-slate-400">evolving</span>. <br />
            Are you architected for it?
          </h2>
          <Button variant="primary" className="rounded-xl px-8" onClick={() => onNavigate('resume')}>Analyze My Profile</Button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full hidden lg:block opacity-10">
          <div className="absolute bottom-0 right-0 p-12">
            <span className="text-[180px] font-black tracking-tighter text-white">2026</span>
          </div>
          <TrendingUp className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 text-indigo-500" />
        </div>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onNavigate(card.id)}
            className="group cursor-pointer glass-panel p-6 rounded-[2rem] hover:bg-white/10 transition-all"
          >
            <div className={`w-12 h-12 ${card.color.replace('bg-', 'bg-')}/20 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform shadow-xl`}>
              <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
            </div>
            <h3 className="text-lg font-bold mb-2 tracking-tight">{card.title}</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed font-medium">{card.desc}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{card.stats}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-400" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-lg font-bold tracking-tight">Recent Recommendations</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="glass-panel rounded-[2rem] p-2 overflow-hidden">
            {[
              { icon: GraduationCap, title: "Next.js Architecture Expert", meta: "High demand in Q3 2026", time: "2h ago", accent: "text-indigo-400" },
              { icon: Target, title: "Strategic Roadmap: GATE 2026", meta: "Updated syllabus analysis", time: "5h ago", accent: "text-emerald-400" },
              { icon: Heart, title: "Micro-SaaS Engineering", meta: "Growth strategy updated", time: "Yesterday", accent: "text-purple-400" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors group cursor-pointer border-b border-white/5 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/5">
                    <item.icon className={`w-6 h-6 ${item.accent}`} />
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight">{item.title}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{item.meta}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Community/News */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold px-4 tracking-tight">System Notifications</h3>
          <div className="glass-panel rounded-[2rem] p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10 flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="font-bold text-sm">System Guidance</p>
                <p className="text-[10px] text-emerald-400 font-mono">Neural Model: 4.2-STABLE</p>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl border border-white/10 shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Upcoming Session</p>
              <h4 className="font-bold text-base leading-tight mb-4">Mastering Generative UI for Production in 2026</h4>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Today</span>
                <span className="flex items-center gap-1 text-emerald-400 shadow shadow-emerald-500/20"><Users className="w-3.5 h-3.5" /> 1.2k attending</span>
              </div>
            </div>
            <Button className="w-full h-11" variant="outline">Access Neural Hub</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
