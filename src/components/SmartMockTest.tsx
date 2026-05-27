import React, { useState, useEffect } from "react";
import { Button, Card, Textarea } from "./ui";
import { 
  Timer, 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  HelpCircle, 
  Code, 
  Briefcase, 
  Brain,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Lightbulb,
  Trophy,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { evaluateMockTest } from "@/src/lib/gemini";

interface Question {
  id: string;
  type: 'mcq' | 'coding' | 'aptitude' | 'scenario' | 'interview';
  question: string;
  options?: string[];
  correctAnswer?: string;
  hint?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface SmartMockTestProps {
  testData: {
    testId: string;
    questions: Question[];
    targetRole: string;
    difficultyAssessed: string;
  };
  userProfile: any;
  onComplete: (evaluation: any) => void;
  onCancel: () => void;
}

export const SmartMockTest = ({ testData, userProfile, onComplete, onCancel }: SmartMockTestProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [testData.questions[currentIdx].id]: answer });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submission = {
        profile: userProfile,
        answers: testData.questions.map(q => ({
          question: q.question,
          type: q.type,
          userAnswer: answers[q.id] || "No answer provided",
          correctAnswer: q.correctAnswer
        }))
      };
      const evaluation = await evaluateMockTest(submission);
      onComplete(evaluation);
    } catch (error) {
      console.error("Evaluation error:", error);
      alert("Evaluation failed. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = testData.questions[currentIdx];
  const progress = ((currentIdx + 1) / testData.questions.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-5xl bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Smart Mock Test</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{testData.targetRole} • {testData.difficultyAssessed}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
              <Timer className={`w-4 h-4 ${timeLeft < 60 ? "text-rose-500 animate-pulse" : "text-emerald-400"}`} />
              <span className={`font-mono text-sm font-bold ${timeLeft < 60 ? "text-rose-500" : "text-slate-300"}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Abandon</button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  Question {currentIdx + 1} of {testData.questions.length}
                </span>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  currentQuestion.difficulty === 'Easy' ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
                  currentQuestion.difficulty === 'Medium' ? "text-amber-400 border-amber-500/20 bg-amber-500/5" :
                  "text-rose-400 border-rose-500/20 bg-rose-500/5"
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white leading-tight">{currentQuestion.question}</h3>
            </div>

            {/* Input Types */}
            <div className="space-y-4">
              {currentQuestion.type === 'mcq' || currentQuestion.type === 'aptitude' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQuestion.options?.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      className={`
                        p-6 rounded-3xl border text-left transition-all duration-300 flex items-center justify-between group
                        ${answers[currentQuestion.id] === option 
                          ? "bg-indigo-500/10 border-indigo-500/40 text-white shadow-lg shadow-indigo-500/10" 
                          : "bg-white/2 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200"
                        }
                      `}
                    >
                      <span className="text-sm font-bold leading-relaxed">{option}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        answers[currentQuestion.id] === option ? "border-indigo-500 bg-indigo-500" : "border-white/10"
                      }`}>
                        {answers[currentQuestion.id] === option && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <Textarea
                  placeholder="Analyze, explain, or code your solution here..."
                  className="min-h-[250px] bg-white/2 border-white/5 rounded-3xl p-8 text-sm font-medium leading-relaxed resize-none focus:border-indigo-500/50 transition-all"
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e: any) => handleAnswer(e.target.value)}
                />
              )}
            </div>

            {/* Hint */}
            <AnimatePresence>
              {showHint && currentQuestion.hint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex gap-4 p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl italic"
                >
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-500/80 font-medium">"{currentQuestion.hint}"</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 border-t border-white/5 bg-white/2 flex items-center justify-between">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-6 rounded-xl border-white/10 text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowHint(!showHint)}
              className="text-amber-400 hover:bg-amber-500/10 px-6 rounded-xl text-xs font-bold uppercase tracking-widest"
            >
              <HelpCircle className="w-4 h-4 mr-2" /> {showHint ? "Hide Hint" : "Need Hint?"}
            </Button>
          </div>

          <div className="flex gap-3">
            {currentIdx < testData.questions.length - 1 ? (
              <Button 
                onClick={() => {
                  setCurrentIdx(prev => prev + 1);
                  setShowHint(false);
                }}
                className="px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold"
              >
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Submit Final Assessment
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const MockTestResult = ({ evaluation, onRestart }: { evaluation: any, onRestart: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="p-10 glass-panel-heavy rounded-[3rem] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
           <div className={`
             px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em]
             ${evaluation.jobReadiness === 'Highly Recommended' ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "text-amber-400 border-amber-500/30 bg-amber-500/5"}
           `}>
             {evaluation.jobReadiness}
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-12 sm:items-center">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="364"
                initial={{ strokeDashoffset: 364 }}
                animate={{ strokeDashoffset: 364 - (364 * evaluation.scorePercentage) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-emerald-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{evaluation.scorePercentage}%</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Score</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Assessment Complete</h2>
            <p className="text-slate-400 font-medium max-w-md leading-relaxed">{evaluation.performanceAnalytics}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
          <div className="p-6 bg-white/2 border border-white/5 rounded-3xl flex flex-col items-center gap-2">
             <Trophy className="w-6 h-6 text-amber-400" />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Readiness</p>
             <p className="text-lg font-black text-white">{evaluation.interviewReadinessScore}%</p>
          </div>
          <div className="p-6 bg-white/2 border border-white/5 rounded-3xl flex flex-col items-center gap-2">
             <BarChart3 className="w-6 h-6 text-indigo-400" />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accuracy</p>
             <p className="text-lg font-black text-white">{evaluation.accuracyLevel}</p>
          </div>
          <div className="p-6 bg-white/2 border border-white/5 rounded-3xl flex flex-col items-center gap-2 text-center">
             <CheckCircle2 className="w-6 h-6 text-emerald-400" />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Strengths</p>
             <p className="text-[10px] font-bold text-slate-300">{evaluation.strengths.length} Areas</p>
          </div>
          <div className="p-6 bg-white/2 border border-white/5 rounded-3xl flex flex-col items-center gap-2">
             <AlertTriangle className="w-6 h-6 text-rose-400" />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Weak Gaps</p>
             <p className="text-[10px] font-bold text-slate-300">{evaluation.weakAreas.length} Areas</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2 px-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Key Strengths
          </h3>
          <div className="space-y-3">
            {evaluation.strengths.map((s: string, i: number) => (
              <div key={i} className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <p className="text-xs font-bold text-slate-300">{s}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2 px-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" /> Areas of Improvement
          </h3>
          <div className="space-y-3">
            {evaluation.weakAreas.map((w: string, i: number) => (
              <div key={i} className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                <p className="text-xs font-bold text-slate-300">{w}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-10 glass-panel rounded-[3rem]">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
          <Lightbulb className="w-5 h-5 text-amber-400" /> Next Evolution Steps
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {evaluation.improvementSuggestions.map((s: string, i: number) => (
            <div key={i} className="p-6 bg-white/2 border border-white/5 rounded-2xl font-medium text-xs text-slate-300 leading-relaxed italic">
              "{s}"
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-8 pb-20">
        <Button onClick={onRestart} className="h-14 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold uppercase tracking-widest text-xs">
          Return to Dashboard
        </Button>
      </div>
    </motion.div>
  );
};
