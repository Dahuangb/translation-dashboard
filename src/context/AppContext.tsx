import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppContextType, UserProgress } from '../types';
import {
  createInitialProgress,
  getTotalQuestionCount,
  getCompletedQuestionCount,
  getKnowledgePointQuestionStats,
  getUnitQuestionStats,
  isKnowledgePointCompleted,
  isUnitCompleted,
  getKnowledgePointCompletionRate,
  getUnitCompletionRate,
  completeQuestion as completeQuestionLogic,
  completeKnowledgePointAllQuestions
} from '../utils/progressLogic';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('mathReviewProgress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...createInitialProgress(),
          ...parsed,
          completionDetails: parsed.completionDetails || {}
        };
      } catch {
        return createInitialProgress();
      }
    }
    return createInitialProgress();
  });

  const [showStarAnimation, setShowStarAnimation] = useState(false);

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('mathReviewProgress', JSON.stringify(newProgress));
  };

  const triggerStarAnimation = () => {
    setShowStarAnimation(true);
    setTimeout(() => setShowStarAnimation(false), 1000);
  };

  const addStars = (count: number) => {
    saveProgress({
      ...progress,
      stars: progress.stars + count
    });
    triggerStarAnimation();
  };

  const completeQuestion = (id: string) => {
    const newProgress = completeQuestionLogic(id, progress);
    if (newProgress !== progress) {
      saveProgress(newProgress);
      triggerStarAnimation();
    }
  };

  const recordCompletion = (kpId: string) => {
    // 这个函数现在主要是为了保持 API 兼容，实际的完成逻辑在 completeQuestion 中处理
    // 这里我们用 completeKnowledgePointAllQuestions 来确保知识点被标记为完成
    const newProgress = completeKnowledgePointAllQuestions(kpId, progress);
    if (newProgress !== progress) {
      saveProgress(newProgress);
      triggerStarAnimation();
    }
  };

  const resetProgress = () => {
    saveProgress(createInitialProgress());
  };

  return (
    <AppContext.Provider value={{ 
      progress, 
      addStars, 
      completeQuestion, 
      resetProgress,
      showStarAnimation,
      triggerStarAnimation,
      isKnowledgePointCompleted: (kpId: string) => isKnowledgePointCompleted(kpId, progress),
      isUnitCompleted: (unitId: string) => isUnitCompleted(unitId, progress),
      getUnitCompletionRate: (unitId: string) => getUnitCompletionRate(unitId, progress),
      getKnowledgePointCompletionRate: (kpId: string) => getKnowledgePointCompletionRate(kpId, progress),
      getCompletedQuestionCount: () => getCompletedQuestionCount(progress),
      getTotalQuestionCount,
      getUnitQuestionStats: (unitId: string) => getUnitQuestionStats(unitId, progress),
      getKnowledgePointQuestionStats: (kpId: string) => getKnowledgePointQuestionStats(kpId, progress),
      recordCompletion
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
