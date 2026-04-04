export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface KnowledgePoint {
  id: string;
  unitId: string;
  unitName: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  content: string[];
  questions: Question[];
}

export interface Unit {
  id: string;
  name: string;
  icon: string;
  color: string;
  knowledgePoints: string[];
}

export interface CompletionDetails {
  completedAt: number;
  totalQuestions: number;
  correctQuestions: number;
}

export interface UserProgress {
  stars: number;
  completedKnowledgePoints: string[];
  completedQuestions: Record<string, boolean>;
  completionDetails: Record<string, CompletionDetails>;
}

export interface AppContextType {
  progress: UserProgress;
  addStars: (count: number) => void;
  completeQuestion: (id: string) => void;
  resetProgress: () => void;
  showStarAnimation: boolean;
  triggerStarAnimation: () => void;
  isKnowledgePointCompleted: (kpId: string) => boolean;
  isUnitCompleted: (unitId: string) => boolean;
  getUnitCompletionRate: (unitId: string) => number;
  getKnowledgePointCompletionRate: (kpId: string) => number;
  getCompletedQuestionCount: () => number;
  getTotalQuestionCount: () => number;
  getUnitQuestionStats: (unitId: string) => { completed: number; total: number };
  getKnowledgePointQuestionStats: (kpId: string) => { completed: number; total: number };
  recordCompletion: (kpId: string) => void;
}
