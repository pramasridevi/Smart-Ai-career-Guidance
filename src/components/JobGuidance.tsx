import React, { useState, useRef } from "react";
import { Button, Card, Input, Textarea } from "./ui";
import { GraduationCap, Loader2, Target, CheckCircle2, AlertCircle, ExternalLink, Search, FileText, Upload, FileUp, Trophy, Calendar, Sparkles } from "lucide-react";
import { analyzeProfile, generateSmartMockTest } from "@/src/lib/gemini";
import { motion, AnimatePresence } from "motion/react";
import * as pdfjs from "pdfjs-dist";
import mammoth from "mammoth";
import { SmartMockTest, MockTestResult } from "./SmartMockTest";
import { AIChatbot } from "./AIChatbot";
import { NexorLogo } from "./NexorLogo";

// @ts-ignore
import workerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

export const JobGuidance = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTest, setActiveTest] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testHistory, setTestHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('nexor_test_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [formData, setFormData] = useState({
    degree: "",
    skills: "",
    github: "",
    leetcode: "",
    resumeText: ""
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromFile = async (file: File) => {
    setIsExtracting(true);
    try {
      const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const isDOCX = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.toLowerCase().endsWith(".docx");

      if (isPDF) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          let fullText = "";
          
          for (let i = 1; i <= pdf.numPages; i++) {
            try {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const strings = (content.items || []).map((item: any) => item.str || "");
              fullText += strings.join(" ") + "\n";
            } catch (pageError) {
              console.warn(`Error extracting page ${i}:`, pageError);
              continue;
            }
          }
          
          if (!fullText.trim()) {
            throw new Error("No text could be extracted from PDF. Resume may be image-based or corrupted.");
          }
          
          setFormData(prev => ({ ...prev, resumeText: fullText }));
          setUploadedFile(file);
        } catch (pdfError: any) {
          console.error("PDF extraction error:", pdfError);
          throw new Error(`PDF extraction failed: ${pdfError.message || "Unable to read PDF"}`);
        }
      } else if (isDOCX) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          
          if (!result.value.trim()) {
            throw new Error("No text could be extracted from DOCX. File may be corrupted.");
          }
          
          setFormData(prev => ({ ...prev, resumeText: result.value }));
          setUploadedFile(file);
        } catch (docError: any) {
          console.error("DOCX extraction error:", docError);
          throw new Error(`DOCX extraction failed: ${docError.message || "Unable to read DOCX"}`);
        }
      } else {
        throw new Error("Unsupported file format. Please upload PDF or DOCX files only.");
      }
    } catch (error: any) {
      console.error("Extraction error:", error);
      alert(`Failed to extract text: ${error.message}\n\nPlease try pasting the text manually or check the file format.`);
      setUploadedFile(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) extractTextFromFile(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setFormData(prev => ({ ...prev, resumeText: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const analysis = await analyzeProfile(formData);
      setResult(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initiateMockTest = async () => {
    setTestLoading(true);
    try {
      const test = await generateSmartMockTest({ ...formData, domain: formData.degree });
      setActiveTest(test);
    } catch (error) {
      console.error("Test gen error:", error);
      alert("Failed to generate test. AI Brain is saturated.");
    } finally {
      setTestLoading(false);
    }
  };

  const handleTestComplete = (evaluation: any) => {
    const newEntry = {
      date: new Date().toISOString(),
      score: evaluation.scorePercentage,
      readiness: evaluation.jobReadiness,
      role: activeTest.targetRole
    };
    const updatedHistory = [newEntry, ...testHistory].slice(0, 10);
    setTestHistory(updatedHistory);
    localStorage.setItem('nexor_test_history', JSON.stringify(updatedHistory));
    
    setTestResult(evaluation);
    setActiveTest(null);
  };

  const getJobSearchLink = (role: string, platform: 'linkedin' | 'indeed') => {
    const query = encodeURIComponent(role);
    return platform === 'linkedin' 
      ? `https://www.linkedin.com/jobs/search/?keywords=${query}`
      : `https://www.indeed.com/jobs?q=${query}`;
  };

  if (testResult) {
    return <MockTestResult evaluation={testResult} onRestart={() => setTestResult(null)} />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      <AIChatbot context="Job Career Guidance & Skills Analysis" />
      {activeTest && (
        <SmartMockTest 
          testData={activeTest} 
          userProfile={formData} 
          onComplete={handleTestComplete} 
          onCancel={() => setActiveTest(null)} 
        />
      )}

      <header className="text-center">
        <div className="w-16 h-16 mx-auto mb-6">
          <NexorLogo variant="icon" className="w-full h-full" />
        </div>
        <h1 className="text-4xl font-bold mb-3 tracking-tight text-white">Neural Job Recommendation</h1>
        <p className="text-slate-400 font-medium">Provide your resume and credentials to reveal your 2026 optimal career trajectory.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Form Column */}
        <div className="space-y-6">
          <Card className="p-8 glass-panel-heavy">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Degree / Domain</label>
                <Input 
                  placeholder="e.g., B.Tech Computer Science" 
                  value={formData.degree} 
                  onChange={(e: any) => setFormData({...formData, degree: e.target.value})}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Core Expertise</label>
                <Textarea 
                  placeholder="e.g., React, AI Agents, Python Engineering..." 
                  value={formData.skills}
                  onChange={(e: any) => setFormData({...formData, skills: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <FileUp className="w-3 h-3 text-indigo-400" /> Professional Vector (Resume)
                </label>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative h-32 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                    ${uploadedFile ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 hover:border-indigo-500/30 hover:bg-white/5"}
                  `}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.docx" 
                    onChange={handleFileChange} 
                  />
                  
                  {isExtracting ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                      <p className="text-[10px] font-black uppercase text-indigo-400 animate-pulse">Extracting Intelligence...</p>
                    </div>
                  ) : uploadedFile ? (
                    <div className="flex flex-col items-center gap-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <p className="text-[10px] font-black text-emerald-400 uppercase">{uploadedFile.name}</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); clearFile(); }}
                        className="text-[9px] font-bold text-rose-400 hover:underline mt-1"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-slate-500 mb-2" />
                      <p className="text-[10px] font-black text-slate-400 uppercase">Drop PDF/DOCX or click to browse</p>
                      <p className="text-[9px] text-slate-600 uppercase mt-1">Automatic Neural Extraction</p>
                    </>
                  )}
                </div>

                <AnimatePresence>
                  {formData.resumeText && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <Textarea 
                        placeholder="Extracted intelligence will appear here..." 
                        className="h-32 text-[11px] font-mono leading-relaxed opacity-60 bg-transparent border-white/5"
                        value={formData.resumeText}
                        onChange={(e: any) => setFormData({...formData, resumeText: e.target.value})}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">GitHub</label>
                  <Input 
                    placeholder="profile_id" 
                    value={formData.github}
                    onChange={(e: any) => setFormData({...formData, github: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">LeetCode</label>
                  <Input 
                    placeholder="profile_id" 
                    value={formData.leetcode}
                    onChange={(e: any) => setFormData({...formData, leetcode: e.target.value})}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-14" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Initiate Full Analysis"}
              </Button>
            </form>
          </Card>

          {/* Test History Section */}
          <div className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2 flex items-center gap-2">
               <Calendar className="w-3 h-3" /> Test History Analytics
             </h3>
             <div className="space-y-2">
               {testHistory.length > 0 ? (
                 testHistory.map((entry, i) => (
                   <div key={i} className="p-4 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between">
                     <div>
                       <p className="text-[10px] font-bold text-white">{entry.role}</p>
                       <p className="text-[8px] text-slate-500">{new Date(entry.date).toLocaleDateString()}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-sm font-black text-emerald-400">{entry.score}%</p>
                       <p className="text-[8px] font-bold text-slate-500 uppercase">{entry.readiness}</p>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="p-8 text-center text-slate-600 border border-white/5 rounded-2xl border-dashed">
                   <p className="text-[9px] font-bold uppercase tracking-widest">No evaluation records found</p>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="space-y-6">
          {!result && !loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 border border-white/5 bg-white/2 rounded-[40px] text-center text-slate-600">
              <Target className="w-12 h-12 mb-4 opacity-10" />
              <p className="font-bold uppercase tracking-widest text-[10px]">Awaiting profile & resume input...</p>
            </div>
          )}

          {loading && (
            <div className="space-y-6 p-8 glass-panel rounded-[40px]">
              <div className="h-8 bg-white/5 rounded-full w-2/3 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
                <div className="h-4 bg-white/5 rounded-full w-5/6 animate-pulse"></div>
                <div className="h-4 bg-white/5 rounded-full w-4/6 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-white/5 rounded-2xl animate-pulse"></div>
                <div className="h-20 bg-white/5 rounded-2xl animate-pulse"></div>
                <div className="h-20 bg-white/5 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Start Mock Test Button */}
              <Button 
                onClick={initiateMockTest}
                disabled={testLoading}
                className="w-full h-20 rounded-[2.5rem] bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 shadow-xl shadow-indigo-500/10 group overflow-hidden relative"
              >
                {testLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 animate-pulse" />
                    <span>Initialize Smart Mock Test</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  </>
                )}
              </Button>

              {/* Probability Score */}
              <Card className="glass-panel text-white p-8 rounded-[40px] flex items-center justify-between overflow-hidden relative shadow-2xl border-white/20">
                <div>
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Market Compatibility</p>
                  <p className="text-6xl font-black">{result.probabilityScore}%</p>
                </div>
                <div className="w-20 h-20 border-4 border-emerald-500/20 rounded-full flex items-center justify-center text-2xl font-black text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                  {result.probabilityScore > 80 ? "A+" : result.probabilityScore > 60 ? "B" : "C"}
                </div>
                <div className={`absolute bottom-0 right-0 h-1 bg-emerald-500 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]`} style={{ width: `${result.probabilityScore}%` }}></div>
              </Card>

              {/* ATS Analysis (Integrated) */}
              {result.atsAnalysis && (
                <div className="p-6 bg-slate-900 border border-white/10 rounded-[2.5rem] space-y-4">
                   <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">ATS Optimization Score</h3>
                    <span className="text-lg font-black text-white">{result.atsAnalysis.score}/100</span>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase">Positives</p>
                        {result.atsAnalysis.positives.slice(0, 3).map((p: string, i: number) => (
                          <p key={i} className="text-[10px] text-slate-400">• {p}</p>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-rose-400 uppercase">Critical Gaps</p>
                        {result.atsAnalysis.deltas.slice(0, 3).map((d: string, i: number) => (
                          <p key={i} className="text-[10px] text-slate-400">• {d}</p>
                        ))}
                      </div>
                   </div>
                </div>
              )}

              {/* Recommended Roles & Job Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                  <CheckCircle2 className="text-emerald-400 w-5 h-5" /> Precision Matches
                </h3>
                <div className="space-y-3">
                  {result.recommendedRoles.map((role: string, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
                      <span className="text-sm font-bold text-slate-200">{role}</span>
                      <div className="flex gap-2">
                        <a 
                          href={getJobSearchLink(role, 'linkedin')} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg text-indigo-400 transition-colors"
                          title="Search on LinkedIn"
                        >
                          <Search className="w-4 h-4" />
                        </a>
                        <a 
                          href={getJobSearchLink(role, 'indeed')} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-colors"
                          title="Search on Indeed"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gap */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                  <AlertCircle className="text-amber-400 w-5 h-5" /> Differential Analysis
                </h3>
                <p className="text-slate-300 bg-amber-500/5 p-8 rounded-[3rem] border border-amber-500/10 leading-relaxed font-medium text-sm italic">
                  "{result.skillGapAnalysis}"
                </p>
              </div>

              {/* Improvements */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold px-2">Actionable Intelligence</h3>
                <div className="space-y-3">
                  {result.improvements.map((tip: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-[10px] font-black text-indigo-400">
                        0{i+1}
                      </div>
                      <p className="text-xs font-medium text-slate-400 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
