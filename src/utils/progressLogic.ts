import { knowledgePoints } from '../data/knowledgePoints';
import { UserProgress } from '../types';

/**
 * 获取总题目数量
 */
export const getTotalQuestionCount = (): number => {
  return knowledgePoints.reduce((sum, kp) => sum + kp.questions.length, 0);
};

/**
 * 获取已完成题目数量
 */
export const getCompletedQuestionCount = (progress: UserProgress): number => {
  return knowledgePoints.reduce((sum, kp) => {
    return sum + kp.questions.filter(q => progress.completedQuestions[q.id]).length;
  }, 0);
};

/**
 * 获取知识点题目统计
 */
export const getKnowledgePointQuestionStats = (kpId: string, progress: UserProgress) => {
  const kp = knowledgePoints.find(k => k.id === kpId);
  if (!kp) return { completed: 0, total: 0 };
  const total = kp.questions.length;
  const completed = kp.questions.filter(q => progress.completedQuestions[q.id]).length;
  return { completed, total };
};

/**
 * 获取单元题目统计
 */
export const getUnitQuestionStats = (unitId: string, progress: UserProgress) => {
  const unitKps = knowledgePoints.filter(kp => kp.unitId === unitId);
  const total = unitKps.reduce((sum, kp) => sum + kp.questions.length, 0);
  const completed = unitKps.reduce((sum, kp) => {
    return sum + kp.questions.filter(q => progress.completedQuestions[q.id]).length;
  }, 0);
  return { completed, total };
};

/**
 * 检查知识点是否已完成（所有题目都完成）
 */
export const isKnowledgePointCompleted = (kpId: string, progress: UserProgress): boolean => {
  const kp = knowledgePoints.find(k => k.id === kpId);
  if (!kp) return false;
  return kp.questions.every(q => progress.completedQuestions[q.id]);
};

/**
 * 检查单元是否已完成（所有知识点的所有题目都完成）
 */
export const isUnitCompleted = (unitId: string, progress: UserProgress): boolean => {
  const unitKps = knowledgePoints.filter(kp => kp.unitId === unitId);
  if (unitKps.length === 0) return false;
  return unitKps.every(kp => isKnowledgePointCompleted(kp.id, progress));
};

/**
 * 获取知识点完成率（百分比）
 */
export const getKnowledgePointCompletionRate = (kpId: string, progress: UserProgress): number => {
  const { completed, total } = getKnowledgePointQuestionStats(kpId, progress);
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * 获取单元完成率（百分比）
 */
export const getUnitCompletionRate = (unitId: string, progress: UserProgress): number => {
  const { completed, total } = getUnitQuestionStats(unitId, progress);
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * 验证题目ID是否存在
 */
const isValidQuestionId = (questionId: string): boolean => {
  return knowledgePoints.some(kp => 
    kp.questions.some(q => q.id === questionId)
  );
};

/**
 * 完成一道题
 */
export const completeQuestion = (questionId: string, progress: UserProgress): UserProgress => {
  // 先验证题目是否存在
  if (!isValidQuestionId(questionId)) {
    return progress;
  }
  // 再检查是否已经完成
  if (progress.completedQuestions[questionId]) {
    return progress;
  }
  return {
    ...progress,
    completedQuestions: { ...progress.completedQuestions, [questionId]: true },
    stars: progress.stars + 1
  };
};

/**
 * 完成知识点的所有题目
 */
export const completeKnowledgePointAllQuestions = (kpId: string, progress: UserProgress): UserProgress => {
  const kp = knowledgePoints.find(k => k.id === kpId);
  if (!kp) return progress;

  let newProgress = { ...progress };
  let starsToAdd = 0;

  kp.questions.forEach(q => {
    if (!newProgress.completedQuestions[q.id]) {
      newProgress = {
        ...newProgress,
        completedQuestions: { ...newProgress.completedQuestions, [q.id]: true }
      };
      starsToAdd += 1;
    }
  });

  // 如果所有题目都完成了，添加完成详情和额外5颗星
  const allDone = kp.questions.every(q => newProgress.completedQuestions[q.id]);
  if (allDone && !newProgress.completionDetails[kpId]) {
    return {
      ...newProgress,
      stars: newProgress.stars + starsToAdd + 5,
      completedKnowledgePoints: [...newProgress.completedKnowledgePoints, kpId],
      completionDetails: {
        ...newProgress.completionDetails,
        [kpId]: {
          completedAt: Date.now(),
          totalQuestions: kp.questions.length,
          correctQuestions: kp.questions.length
        }
      }
    };
  }

  return {
    ...newProgress,
    stars: newProgress.stars + starsToAdd
  };
};

/**
 * 创建初始进度
 */
export const createInitialProgress = (): UserProgress => ({
  stars: 0,
  completedKnowledgePoints: [],
  completedQuestions: {},
  completionDetails: {}
});
