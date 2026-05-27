import React, { useState } from "react";
import { Button, Card, Input } from "./ui";
import { Heart, Loader2, Rocket, DollarSign, Globe, Briefcase, ChevronRight, Check, Map, Search } from "lucide-react";
import { passionTransitionPlan } from "@/src/lib/gemini";
import { motion } from "framer-motion";
import { AIChatbot } from "./AIChatbot";
import { NexorLogo } from "./NexorLogo";

export const PassionSupport = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [current, setCurrent] = useState("");
  const [passion, setPassion] = useState("");
  const [location, setLocation] = useState("");

  const examples = [
    { from: "B.Tech Student", to: "Professional Photographer" },
    { from: "Corporate Manager", to: "Yoga Instructor" },
    { from: "Housewife", to: "E-commerce Entrepreneur" },
    { from: "IT Consultant", to: "Organic Farmer" }
  ];

  const handleSubmit = async (e: React.FormEvent, customPair?: {from: string, to: string}) => {
    if (e) e.preventDefault();
    const f = customPair ? customPair.from : current;
    const t = customPair ? customPair.to : passion;
    
    if (!f || !t) return;

    setLoading(true);
    try {
      const plan = await passionTransitionPlan(f, t, location);
      setResult(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      <AIChatbot context={`Career Transition from ${current || 'Current Role'} to ${passion || 'New Passion'}`} />
      <header className="text-center">
        <div className="w-16 h-16 mx-auto mb-6">
          <NexorLogo variant="icon" className="w-full h-full" />
        </div>
        <h1 className="text-4xl font-bold mb-3 tracking-tight">Passion Transition Architecture</h1>
        <p className="text-slate-400 font-medium">Re-engineer your career trajectory from hobbyist to professional pioneer.</p>
      </header>

      {/* Wizard Form */}
      <Card className="p-10 max-w-2xl mx-auto glass-panel-heavy rounded-[3rem] border-white/10 ring-1 ring-white/5">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-[1fr_auto_1fr_1fr] gap-4 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Vector</label>
              <Input placeholder="e.g. IT Engineer" value={current} onChange={(e: any) => setCurrent(e.target.value)} />
            </div>
            <div className="flex justify-center pb-2 hidden md:flex text-slate-700 px-2">
              <ChevronRight className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target Core</label>
              <Input placeholder="e.g. Street Photographer" value={passion} onChange={(e: any) => setPassion(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Location (Optional)</label>
              <Input placeholder="e.g. New York, Online" value={location} onChange={(e: any) => setLocation(e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Deploy Transition Plan"}
          </Button>
        </form>
        
        <div className="mt-10 pt-8 border-t border-white/5">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Neural Simulations:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {examples.map((ex, i) => (
              <button 
                key={i} 
                onClick={() => { setCurrent(ex.from); setPassion(ex.to); handleSubmit(undefined, ex); }}
                className="text-left p-4 rounded-2xl border border-white/5 bg-white/2 hover:border-indigo-500/30 hover:bg-white/5 transition-all group"
              >
                <p className="text-slate-500 text-[9px] uppercase font-bold mb-1">{ex.from}</p>
                <p className="font-bold text-slate-200 text-xs group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{ex.to}</p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="py-20 text-center space-y-6">
          <div className="flex justify-center gap-2">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-3 h-3 bg-orange-500 rounded-full"></motion.div>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-3 h-3 bg-orange-500 rounded-full"></motion.div>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-3 h-3 bg-orange-500 rounded-full"></motion.div>
          </div>
          <p className="text-neutral-500 font-medium">Drafting your new future...</p>
        </div>
      ) : result && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => { setResult(null); setCurrent(""); setPassion(""); }}
              className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 w-fit"
            >
              &larr; Start New Transition
            </button>
          </div>
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Transition Steps */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Rocket className="text-orange-500" /> Milestone Steps
            </h3>
            <div className="space-y-4">
              {result.transitionSteps.map((step: string, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex gap-4 p-6 bg-white border border-neutral-100 rounded-[32px] hover:shadow-lg transition-shadow"
                >
                  <div className="w-10 h-10 shrink-0 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center font-black">
                    {i + 1}
                  </div>
                  <p className="font-medium text-neutral-800 leading-relaxed">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Col */}
          <div className="space-y-10">
            {/* Learning Path */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Globe className="text-blue-500" /> Skill Learning Path
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {result.learningPath.map((skill: string, i: number) => (
                   <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-blue-500/30 transition-all">
                    <Check className="text-green-500 w-5 h-5 shrink-0" />
                    <span className="font-semibold text-sm text-slate-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Centers */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Map className="text-emerald-500" /> Learning Centers & Hubs
              </h3>
              <div className="space-y-3">
                {result.learningCenters.map((center: string, i: number) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] group hover:bg-emerald-500/10 transition-all">
                    <p className="text-xs font-bold text-slate-300 flex-1">{center}</p>
                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent(center)}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl text-emerald-400 transition-colors"
                      title="Find Location"
                    >
                      <Search className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Monetization */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <DollarSign className="text-green-600" /> Monetization Strategy
              </h3>
              <div className="p-8 bg-slate-900 border border-white/5 rounded-[40px] space-y-4 shadow-2xl">
                {result.monetizationIdeas.map((idea: string, i: number) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{idea}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Briefcase className="text-neutral-600" /> Recommended Platforms
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.platforms.map((platform: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full text-sm font-bold uppercase tracking-wider">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};
