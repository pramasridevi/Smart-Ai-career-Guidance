import React, { useState } from "react";
import { Button, Card, Input } from "./ui";
import { Target, Loader2, Calendar, Map, CheckCircle2, Lightbulb, BookOpen, Video, FileCheck, Search, X } from "lucide-react";
import { generateExamRoadmap } from "@/src/lib/gemini";
import { motion, AnimatePresence } from "motion/react";

import { AIChatbot } from "./AIChatbot";
import { NexorLogo } from "./NexorLogo";

export const ExamPrep = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [examName, setExamName] = useState("");
  const [months, setMonths] = useState<number>(6);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [showMockTest, setShowMockTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [testResultScore, setTestResultScore] = useState<number | null>(null);

  const startMockTest = () => {
    setShowMockTest(true);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setTestResultScore(null);
    setSelectedModule(null);
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const submitTest = () => {
    let score = 0;
    result.simulatedMockTest.questions.forEach((q: any, i: number) => {
      if (userAnswers[i] === q.correct) score++;
    });
    setTestResultScore((score / result.simulatedMockTest.questions.length) * 100);
  };

  const popularExams = ["UPSC", "NEET", "JEE Mains", "GATE", "CAT", "GMAT"];

  const handleSubmit = async (e?: React.FormEvent, customExam?: string) => {
    if (e) e.preventDefault();
    const query = customExam || examName;
    if (!query) return;

    setLoading(true);
    setResult(null);
    setSelectedModule(null);
    setShowMockTest(false);
    try {
      const roadmap = await generateExamRoadmap(query, months);
      setResult(roadmap);
    } catch (err) {
      console.error("Error generating roadmap:", err);
    } finally {
      setLoading(false);
    }
  };

  const getVideoSearchLink = (query: string) => {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      <AIChatbot context={`Exam Preparation for ${examName || 'Competitive Exams'}`} />
      <header className="text-center">
        <div className="w-16 h-16 mx-auto mb-6">
          <NexorLogo variant="icon" className="w-full h-full" />
        </div>
        <h1 className="text-4xl font-bold mb-3 tracking-tight">Exam Mastery & Roadmaps</h1>
        <p className="text-slate-400 font-medium">Strategic STUDY pilots designed for peak efficiency in competitive environments.</p>
      </header>

      {/* Selector */}
      <div className="flex flex-col items-center gap-8">
        <form onSubmit={handleSubmit} className="flex gap-4 w-full max-w-xl glass-panel p-2 rounded-3xl">
          <Input 
            placeholder="Search any exam (UPSC, GATE, GRE...)" 
            className="h-14 border-0 bg-transparent focus:ring-0 flex-1"
            value={examName}
            onChange={(e: any) => setExamName(e.target.value)}
          />
          <Input 
            type="number"
            min="1"
            max="24"
            placeholder="Months" 
            className="h-14 w-28 border-0 bg-transparent focus:ring-0 shrink-0 text-center text-white"
            value={months}
            onChange={(e: any) => setMonths(Number(e.target.value))}
          />
          <Button type="submit" size="lg" className="h-14 shrink-0 rounded-2xl px-10" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Plan Map"}
          </Button>
        </form>

        <div className="flex flex-wrap justify-center gap-3">
          {popularExams.map(exam => (
            <button
              key={exam}
              onClick={() => { setExamName(exam); handleSubmit(undefined, exam); }}
              className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/20 transition-all"
            >
              {exam}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="lg:col-span-3 h-64 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="animate-pulse text-xs font-black uppercase tracking-widest">Building Neural Roadmap...</p>
          </div>
        ) : result ? (
          <>
            {/* Action Bar */}
            <div className="lg:col-span-3 mb-2">
              <button 
                onClick={() => { setResult(null); setExamName(""); }}
                className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 w-fit"
              >
                &larr; Back to Search
              </button>
            </div>
            {/* Left Col - Key Phases & Difficulty */}
            <div className="lg:col-span-1 space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                <Map className="w-5 h-5 text-emerald-400" /> Strategic Phases
              </h3>
              <div className="space-y-4">
                {result.keyStages.map((stage: string, i: number) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i}
                    className="p-6 glass-panel rounded-[2rem] shadow-xl relative overflow-hidden"
                  >
                    <span className="absolute top-4 right-4 text-[10px] font-black opacity-20 text-slate-400 uppercase tracking-widest">Stage 0{i+1}</span>
                    <p className="font-bold text-sm mb-4 pr-8 line-clamp-2">{stage}</p>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" 
                        style={{ width: `${(i+1) * 25}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="p-8 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[2.5rem] border border-white/10 shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Complexity Rating</p>
                <p className="text-2xl font-black">{result.difficultyLevel}</p>
              </div>

              {/* Modules List */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 px-2 flex items-center gap-2">
                   <BookOpen className="w-4 h-4 text-indigo-400" /> Neural Modules
                </h3>
                <div className="space-y-2">
                   {result.modules.map((mod: any, i: number) => (
                     <button 
                      key={i} 
                      onClick={() => setSelectedModule(mod)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all text-xs font-bold leading-relaxed
                        ${selectedModule?.name === mod.name ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-400" : "bg-white/2 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200"}
                      `}
                     >
                       {mod.name}
                     </button>
                   ))}
                </div>
              </div>
            </div>

            {/* Right Col - Content View */}
            <div className="lg:col-span-2 space-y-8">
              {/* Module Content / Notes */}
              <AnimatePresence mode="wait">
                {selectedModule ? (
                  <motion.div 
                    key={selectedModule.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-8 glass-panel-heavy rounded-[3rem] border-indigo-500/10 min-h-[300px] flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-xl font-bold text-white tracking-tight">{selectedModule.name}</h2>
                      <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Active Module</span>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">{selectedModule.notes}</p>
                    </div>
                    <div className="pt-8 border-t border-white/5 space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
                        <Video className="w-3 h-3" /> Recommended Module Tutorials
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {selectedModule.tutorials.map((t: string, i: number) => (
                          <div key={i} className="p-4 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between group">
                            <span className="text-[10px] font-bold text-slate-400 truncate">{t}</span>
                            <a 
                              href={getVideoSearchLink(t)} 
                              target="_blank" 
                              rel="noreferrer"
                              className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-colors"
                            >
                              <Search className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                      <button 
                        onClick={() => setSelectedModule(null)}
                        className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest"
                      >
                        Back to Roadmap
                      </button>
                    </div>
                  </motion.div>
                ) : showMockTest ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-10 glass-panel-heavy rounded-[3rem] border-emerald-500/10 space-y-10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1">Neural Mock Simulation</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verify your proficiency levels</p>
                      </div>
                      <button onClick={() => setShowMockTest(false)} className="text-slate-600 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                    </div>

                    {testResultScore !== null ? (
                      <div className="text-center py-12 space-y-6">
                        <div className="w-24 h-24 rounded-full border-4 border-emerald-500 flex items-center justify-center mx-auto mb-6">
                          <span className="text-3xl font-black text-white">{testResultScore}%</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">Assessment Complete</h3>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto">
                          {testResultScore > 70 ? "Exceptional performance. You are ready for high-stakes execution." : "Solid foundation detected. Recommend revisiting core modules for total mastery."}
                        </p>
                        <Button onClick={startMockTest} className="rounded-xl px-12 bg-indigo-600 hover:bg-indigo-700">Retake Simulation</Button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                             <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-black text-indigo-400">Q {currentQuestion + 1} / {result.simulatedMockTest.questions.length}</span>
                          </div>
                          <p className="text-lg font-bold text-white leading-relaxed">{result.simulatedMockTest.questions[currentQuestion].q}</p>
                        </div>

                        <div className="grid gap-3">
                          {result.simulatedMockTest.questions[currentQuestion].options.map((opt: string, i: number) => (
                            <button
                              key={i}
                              onClick={() => handleAnswer(opt)}
                              className={`w-full text-left p-5 rounded-2xl border transition-all text-sm font-bold
                                ${userAnswers[currentQuestion] === opt ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-400 shadow-lg shadow-indigo-500/5" : "bg-white/2 border-white/5 text-slate-400 hover:border-white/10"}
                              `}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-8">
                          <button 
                            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestion === 0}
                            className="text-slate-500 hover:text-white transition-colors text-xs font-bold disabled:opacity-30"
                          >
                            Previous
                          </button>
                          {currentQuestion < result.simulatedMockTest.questions.length - 1 ? (
                            <Button 
                              onClick={() => setCurrentQuestion(prev => prev + 1)}
                              disabled={!userAnswers[currentQuestion]}
                              className="rounded-xl bg-indigo-600 px-8"
                            >
                              Next Question
                            </Button>
                          ) : (
                            <Button 
                              onClick={submitTest}
                              disabled={!userAnswers[currentQuestion]}
                              className="rounded-xl bg-emerald-500 text-slate-900 font-bold px-10"
                            >
                              Finish Assessment
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    {/* Operational Timeline */}
                    <div className="space-y-6">
                      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 px-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400" /> Operational Timeline
                      </h3>
                      <div className="space-y-4 glass-panel p-8 rounded-[3rem] border-white/5">
                        {result.studyPlan.map((plan: string, i: number) => (
                          <div key={i} className="flex gap-6 group">
                            <div className="flex flex-col items-center shrink-0">
                              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center font-black text-[10px] text-slate-500 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-all">
                                M{i+1}
                              </div>
                              {i < result.studyPlan.length - 1 && <div className="w-px flex-1 bg-white/5 my-2"></div>}
                            </div>
                            <div className="pb-8 pt-1">
                              <p className="text-slate-300 text-sm leading-relaxed font-medium transition-colors group-hover:text-white">{plan}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Access Actions */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Button 
                        onClick={startMockTest}
                        className="h-20 rounded-[2rem] bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/10"
                      >
                        <FileCheck className="w-5 h-5" /> Initialize Mock Simulation
                      </Button>
                      <Button 
                        onClick={() => setSelectedModule(result.modules[0])}
                        className="h-20 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/10"
                      >
                        <BookOpen className="w-5 h-5" /> Start Learning
                      </Button>
                    </div>

                    {/* Video Resources */}
                    <div className="space-y-6 pt-4">
                      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 px-2 flex items-center gap-2">
                        <Video className="w-4 h-4 text-rose-500" /> Neural Video References
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {result.videoReferences.map((video: string, i: number) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-2xl group hover:bg-white/5 transition-all">
                            <p className="text-[11px] font-bold text-slate-400 group-hover:text-slate-200 truncate pr-4">{video}</p>
                            <a 
                              href={getVideoSearchLink(video)} 
                              target="_blank" 
                              rel="noreferrer"
                              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-rose-400 transition-colors"
                            >
                              <Search className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="lg:col-span-3 py-20 text-center glass-panel rounded-[4rem] border-dashed">
            <Map className="w-16 h-16 text-slate-800 mx-auto mb-6 opacity-20" />
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Neural Roadmap Unavailable - Search Initiated</p>
          </div>
        )}
      </div>
    </div>
  );
};
