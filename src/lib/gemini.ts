import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function cleanAndParse(text: string) {
  try {
    return JSON.parse(text.replace(/```json\n?/g, "").replace(/\n?```/g, "").trim());
  } catch (err) {
    console.error("Failed to parse AI response:", text);
    throw err;
  }
}

export async function analyzeProfile(data: any) {
  const prompt = `Analyze this student/graduate profile or resume for career guidance in 2026:
  Degree/Domain: ${data.degree}
  Skills/Expertise: ${data.skills}
  GitHub: ${data.github || "N/A"}
  LeetCode: ${data.leetcode || "N/A"}
  Resume Text (Optional): ${data.resumeText || "N/A"}
  
  Provide a detailed analysis in JSON format:
  - recommendedRoles: Array of job roles
  - skillGapAnalysis: String describing missing skills
  - probabilityScore: Number (0-100) probability of getting a job
  - improvements: Array of suggestions (courses, projects, resume tips)
  - atsAnalysis: (Optional) If resume was provided, score and feedback for ATS optimization.`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
          skillGapAnalysis: { type: Type.STRING },
          probabilityScore: { type: Type.NUMBER },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          atsAnalysis: { 
            type: Type.OBJECT, 
            properties: {
              score: { type: Type.NUMBER },
              positives: { type: Type.ARRAY, items: { type: Type.STRING } },
              deltas: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        },
        required: ["recommendedRoles", "skillGapAnalysis", "probabilityScore", "improvements"]
      }
    }
  });

  return cleanAndParse(response.text);
}

export async function generateExamRoadmap(exam: string, months: number = 6) {
  const prompt = `Generate a comprehensive ${months}-month roadmap, study plan, and resources for ${exam} in 2026. 
  Include:
  - keyStages: Main phases of preparation
  - studyPlan: A monthly breakdown containing exactly ${months} strings. Each string should describe the focus for that month.
  - confidenceTips: Suggestions for mental preparation
  - difficultyLevel: String (Easy/Medium/Hard)
  - modules: Array of objects { name: string, notes: string, tutorials: string[] } - Detailed readable study notes and recommended tutorial titles for each.
  - videoReferences: Search queries or specific channels/videos for reference
  - simulatedMockTest: Object { questions: Array of objects { q: string, options: string[], correct: string } } - A 5-question quick assessment.`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          keyStages: { type: Type.ARRAY, items: { type: Type.STRING } },
          studyPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
          confidenceTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          difficultyLevel: { type: Type.STRING },
          modules: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                notes: { type: Type.STRING },
                tutorials: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            } 
          },
          videoReferences: { type: Type.ARRAY, items: { type: Type.STRING } },
          simulatedMockTest: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    q: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correct: { type: Type.STRING }
                  }
                }
              }
            }
          }
        },
        required: ["keyStages", "studyPlan", "confidenceTips", "difficultyLevel", "modules", "videoReferences", "simulatedMockTest"]
      }
    }
  });

  return cleanAndParse(response.text);
}

export async function chatWithAI(message: string, context: string) {
  const prompt = `You are Nexor AI, an elite career and education consultant. 
  Current Module Context: ${context}
  
  User Question: ${message}
  
  Provide professional, encouraging, and highly specific guidance. If the user is unsure about their path, help them evaluate their strengths. Keep responses concise and formatted for a chat UI.`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt
  });

  return response.text;
}

export async function passionTransitionPlan(from: string, to: string, location?: string) {
  const prompt = `Create a step-by-step transition plan for someone moving from ${from} to ${to}.
  Include:
  - learningPath: Key skills to acquire
  - monetizationIdeas: How to earn from this passion
  - platforms: Suggested websites/apps for freelancing or learning
  - transitionSteps: Milestones for the switch
  - learningCenters: Nearest physical types of places to learn (e.g., local studios, specialized hubs) or top global online institutions/centers${location ? `, preferably near or specific to ${location}` : ''}.`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          learningPath: { type: Type.ARRAY, items: { type: Type.STRING } },
          monetizationIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
          platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
          transitionSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
          learningCenters: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["learningPath", "monetizationIdeas", "platforms", "transitionSteps", "learningCenters"]
      }
    }
  });

  return cleanAndParse(response.text);
}

export async function analyzeResume(resumeText: string) {
    const prompt = `Analyze this resume and provide feedback for improvement.
    
    Resume Text:
    ${resumeText}
    
    Provide JSON response:
    - score: Number (0-100)
    - strengths: Array of strings
    - weaknesses: Array of strings
    - formattingTips: Array of suggestions
    - keywordOptimization: Recommended keywords to add`;

    const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.NUMBER },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    formattingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                    keywordOptimization: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["score", "strengths", "weaknesses", "formattingTips", "keywordOptimization"]
            }
        }
    });

    return cleanAndParse(response.text);
}

export async function generateSmartMockTest(profile: any) {
  const prompt = `Generate a personalized, high-stakes smart mock test for a 2026 recruitment assessment.
  User Profile:
  - Degree/Domain: ${profile.degree}
  - Skills: ${profile.skills}
  - GitHub/LeetCode: ${profile.github}, ${profile.leetcode}
  - Resume Content: ${profile.resumeText || "N/A"}
  
  The test must be adaptive to their experience level (Beginner/Intermediate/Advanced).
  Generate exactly 10 questions in JSON format:
  - MCQs (Technical & Domain)
  - Coding Problems (Logic & Syntax)
  - Aptitude (Logical Reasoning)
  - Scenario-based (Behavioral/Problem Solving)
  - Technical Interview (Open-ended)

  Include for each question:
  - id: Unique string
  - type: 'mcq' | 'coding' | 'aptitude' | 'scenario' | 'interview'
  - question: The problem statement
  - options: (For mcq/aptitude) Array of 4 strings
  - correctAnswer: (For mcq/aptitude) The correct option string
  - hint: A helpful tip
  - difficulty: 'Easy' | 'Medium' | 'Hard'`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          testId: { type: Type.STRING },
          difficultyAssessed: { type: Type.STRING },
          targetRole: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                hint: { type: Type.STRING },
                difficulty: { type: Type.STRING }
              },
              required: ["id", "type", "question", "difficulty"]
            }
          }
        },
        required: ["testId", "questions", "difficultyAssessed", "targetRole"]
      }
    }
  });

  return cleanAndParse(response.text);
}

export async function evaluateMockTest(submission: any) {
  const prompt = `Evaluate this recruitment assessment submission.
  Profile of User: ${JSON.stringify(submission.profile)}
  Questions and User Answers: ${JSON.stringify(submission.answers)}
  
  Evaluate technical accuracy, coding logic, and scenario alignment.
  
  Provide JSON response:
  - scorePercentage: Number
  - accuracyLevel: String
  - performanceAnalytics: String
  - strengths: Array of strings
  - weakAreas: Array of strings
  - improvementSuggestions: Array of suggestions
  - jobReadiness: 'Highly Recommended' | 'Eligible' | 'Needs Improvement'
  - interviewReadinessScore: Number (0-100)`;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scorePercentage: { type: Type.NUMBER },
          accuracyLevel: { type: Type.STRING },
          performanceAnalytics: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weakAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          jobReadiness: { type: Type.STRING },
          interviewReadinessScore: { type: Type.NUMBER }
        },
        required: ["scorePercentage", "accuracyLevel", "performanceAnalytics", "strengths", "weakAreas", "improvementSuggestions", "jobReadiness", "interviewReadinessScore"]
      }
    }
  });

  return cleanAndParse(response.text);
}
