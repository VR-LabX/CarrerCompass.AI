
export interface QuestData {
  questName: string;
  mainObjective: string;
  dailyQuests: {
    id: string;
    title: string;
    xp: number;
    bonus: string | null;
  }[];
  bossBattle: {
    name: string;
    requirements: { label: string; progress: string }[];
    rewards: string[];
  };
  debuffs: {
    title: string;
    desc: string;
    fix: string;
  }[];
}

export interface QuestProgress {
  active: boolean;
  role: string;
  days: number;
  startDate: string; // ISO String
  lastDailyRefresh?: string; // ISO String of last refresh date
  level: string;
  xp: number;
  userLevel: number; // The gamified level (1-10)
  completedDailies: string[]; // List of IDs
  questData: QuestData;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  targetRole: string;
  skills: string[];
  graduationYear: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  atsScore?: number;
  questProgress?: QuestProgress;
  atsBreakdown?: {
    keyword_relevance: number;
    formatting: number;
    content_strength: number;
    role_alignment: number;
    completeness: number;
  };
  applications?: ApplicationEntry[];
  interviewSessions?: InterviewSession[];
  skillGapResult?: SkillGapResult;
  chatHistory?: ChatMessage[];
  savedJobs?: string[];
}

export interface RoadmapNode {
  id: string;
  label: string;
  order: number;
  mandatory: boolean;
  description?: string; // Optional field for UI richness
}

export interface RoadmapSection {
  section_name: string;
  learning_stage: string;
  nodes: RoadmapNode[];
}

export interface RoadmapData {
  role: string;
  roadmap_style: string;
  sections: RoadmapSection[];
  dependencies: { from: string; to: string }[];
  learning_notes: {
    order_not_strict: boolean;
    beginner_friendly: boolean;
  };
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  type: 'Internship' | 'Co-op' | 'Full-time' | 'Remote';
  location: string;
  stipend: string;
  skills: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Stretch';
  eligibleYear: number[]; // Changed to array for multiple batches
  postedDate: string;
  deadline: string;
  isVerified: boolean;
  verificationSource?: string; // e.g. "Placement Cell"
}

export interface PrepPlan {
  dailyPlan: string;
  milestones: string[];
  riskAlerts: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface KeywordGap {
  keyword: string;
  frequency: string; // e.g. "High in JD"
  placement_suggestion: string; // e.g. "Skills Section"
}

export interface ATSAnalysis {
  ats_score: {
    total: number;
    projected_score: string;
    confidence: 'High' | 'Medium' | 'Low';
    breakdown: {
      keyword_relevance: number;
      formatting: number;
      content_strength: number;
      role_alignment: number;
      completeness: number;
    };
    summary: string;
    top_factors: string[]; // Top 3 factors lowering score
    ats_killers: string[]; // Top 2 damaging issues
  };
  keyword_analysis: {
    critical: KeywordGap[];
    important: KeywordGap[];
    nice_to_have: KeywordGap[];
  };
  bullet_improvements: {
    original: string;
    improved: string;
    status: 'Weak' | 'Average' | 'Strong';
    improvement_type: string;
    rewrite_mode: 'Conservative' | 'Aggressive';
    why_it_works: string[];
    issue_note?: string; // E.g. "Reduces score by X points..."
  }[];
  formatting_feedback: {
    issues: string[];
    suggestions: string[];
  };
  verdict: {
    status: 'Not ATS Ready' | 'Partially Ready' | 'Interview Ready';
    reasons: string[];
    time_to_fix: string;
  };
  recruiter_reality_check: string; // Blunt assessment
}

// ─── Application Tracker ─────────────────────────────────────────────────────
export type ApplicationStatus = 'Wishlist' | 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';

export interface ApplicationEntry {
  id: string;
  company: string;
  role: string;
  location?: string;
  link?: string;
  deadline?: string;
  notes?: string;
  status: ApplicationStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// ─── Mock Interview ──────────────────────────────────────────────────────────
export interface InterviewQA {
  question: string;
  questionType: 'Behavioral' | 'Technical' | 'Mixed';
  userAnswer: string;
  score: number;        // 0-100
  feedback: string;
  strongerRephrasing: string;
}

export interface InterviewSession {
  id: string;
  role: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  sessionType: 'Behavioral' | 'Technical' | 'Mixed';
  totalQuestions: number;
  completedAt: string;  // ISO string
  overallScore: number; // avg of QA scores
  qa: InterviewQA[];
}

// ─── Skill Gap Analyzer ──────────────────────────────────────────────────────
export interface SkillItem {
  name: string;
  level: 'Strong' | 'Partial' | 'Missing';
  importance: 'Critical' | 'Important' | 'Nice to Have';
  resource?: string;  // recommended learning link or course name
}

export interface SkillCategory {
  category: string;       // e.g. "Frontend", "Data Structures"
  score: number;          // 0-100 proficiency score
  skills: SkillItem[];
}

export interface SkillGapResult {
  role: string;
  analyzedAt: string;     // ISO string
  overallReadiness: number; // 0-100
  categories: SkillCategory[];
  topPriorities: string[];  // top 3 skills to focus on
  estimatedTimeToReady: string; // e.g. "6-8 weeks"
}

