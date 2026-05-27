import { motion } from "framer-motion";
import { Button } from "@/src/components/ui";
import { Compass, GraduationCap, Target, Heart, ArrowRight, CheckCircle2 } from "lucide-react";

import { NexorLogo } from "./NexorLogo";

export const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans relative overflow-hidden">
      {/* Mesh Gradient Backgrounds */}
      <div className="mesh-gradient-1"></div>
      <div className="mesh-gradient-2"></div>
      <div className="mesh-gradient-3"></div>

      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <NexorLogo variant="icon" className="w-full h-full" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">NEXOR AI</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" onClick={onGetStarted}>Sign In</Button>
          <Button variant="primary" size="sm" onClick={onGetStarted}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest mb-8">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            Neural Career Processing Engine
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
            A future built <br />
            <span className="italic font-serif text-indigo-400">by design</span>.
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Personalized guidance, algorithmic roadmaps, and career transition mapping. 
            Step into the 2026 job market with peak confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button size="lg" className="h-16 px-10 text-lg shadow-2xl shadow-indigo-500/20" onClick={onGetStarted}>
              Initialize Experience <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative rounded-[3rem] overflow-hidden aspect-[16/9] max-w-5xl mx-auto border border-white/10 shadow-[0_0_100px_rgba(79,70,229,0.1)] bg-white/5 backdrop-blur-2xl"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <span className="text-[140px] font-black tracking-tighter">2026</span>
            </div>
            <img 
              src="https://picsum.photos/seed/orizon/1920/1080?grayscale&blur=2" 
              alt="Futuristic Workspace" 
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
            
            {/* Abstract Overlay Elements */}
            <div className="absolute bottom-12 left-12 text-left">
              <p className="text-4xl font-bold mb-2">92%</p>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-black">Market Success Rate</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Grid Features */}
      <section className="px-6 py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: "Job Guidance",
                accent: "text-indigo-400",
                desc: "Algorithmic analysis of your unique skill set matched against evolving market demands."
              },
              {
                icon: Target,
                title: "Exam Mastery",
                accent: "text-emerald-400",
                desc: "Strategic preparation roadmaps designed for total dominance in competitive examinations."
              },
              {
                icon: Heart,
                title: "Passion Hub",
                accent: "text-purple-400",
                desc: "Structured monetization paths for creative souls looking to break traditional boundaries."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-white/20 transition-colors shadow-xl">
                  <feature.icon className={`w-6 h-6 ${feature.accent}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">{feature.desc}</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Neural Sync Active
                  </li>
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Banner */}
      <section className="px-6 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center glass-panel-heavy p-16 rounded-[4rem]">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">
            The best way to predict the future is to <span className="font-serif italic text-indigo-400 underline decoration-indigo-400/30 decoration-8 underline-offset-8">architect</span> it.
          </h2>
          <Button variant="primary" size="lg" className="rounded-2xl" onClick={onGetStarted}>Initiate Deployment</Button>
        </div>
      </section>

      <footer className="p-12 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest border-t border-white/5 bg-white/5 backdrop-blur-md">
        &copy; 2026 NEXOR NEURAL SYSTEMS. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
};
