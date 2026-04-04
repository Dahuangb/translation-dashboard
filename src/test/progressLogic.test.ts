import { describe, it, expect, beforeEach } from 'vitest';
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
  completeQuestion,
  completeKnowledgePointAllQuestions,
} from '../utils/progressLogic';
import { knowledgePoints } from '../data/knowledgePoints';

const TEST_KP_ID = 'kp2-1'; // 轴对称图形（有2道题）
const TEST_UNIT_ID = 'unit2'; // 图形的运动

describe('Progress Logic - 基础数据测试', () => {
  it('应该正确加载知识点和单元数据', () => {
    expect(knowledgePoints.length).toBeGreaterThan(0);
    expect(getTotalQuestionCount()).toBeGreaterThan(0);
  });

  it('应该创建正确的初始进度', () => {
    const progress = createInitialProgress();
    expect(progress.stars).toBe(0);
    expect(progress.completedKnowledgePoints.length).toBe(0);
    expect(Object.keys(progress.completedQuestions).length).toBe(0);
    expect(Object.keys(progress.completionDetails).length).toBe(0);
  });
});

describe('Progress Logic - 计数函数测试', () => {
  let initialProgress: ReturnType<typeof createInitialProgress>;

  beforeEach(() => {
    initialProgress = createInitialProgress();
  });

  it('getCompletedQuestionCount - 初始状态应该返回0', () => {
    expect(getCompletedQuestionCount(initialProgress)).toBe(0);
  });

  it('getKnowledgePointQuestionStats - 应该返回正确的题目统计', () => {
    const stats = getKnowledgePointQuestionStats(TEST_KP_ID, initialProgress);
    expect(stats.total).toBe(2);
    expect(stats.completed).toBe(0);
  });

  it('getUnitQuestionStats - 应该返回正确的单元题目统计', () => {
    const stats = getUnitQuestionStats(TEST_UNIT_ID, initialProgress);
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.completed).toBe(0);
  });
});

describe('Progress Logic - 状态检查函数测试', () => {
  let initialProgress: ReturnType<typeof createInitialProgress>;

  beforeEach(() => {
    initialProgress = createInitialProgress();
  });

  it('isKnowledgePointCompleted - 初始状态应该返回false', () => {
    expect(isKnowledgePointCompleted(TEST_KP_ID, initialProgress)).toBe(false);
  });

  it('isUnitCompleted - 初始状态应该返回false', () => {
    expect(isUnitCompleted(TEST_UNIT_ID, initialProgress)).toBe(false);
  });

  it('getKnowledgePointCompletionRate - 初始状态应该返回0', () => {
    expect(getKnowledgePointCompletionRate(TEST_KP_ID, initialProgress)).toBe(0);
  });

  it('getUnitCompletionRate - 初始状态应该返回0', () => {
    expect(getUnitCompletionRate(TEST_UNIT_ID, initialProgress)).toBe(0);
  });
});

describe('Progress Logic - 完成题目测试', () => {
  let initialProgress: ReturnType<typeof createInitialProgress>;
  const testKp = knowledgePoints.find(kp => kp.id === TEST_KP_ID)!;
  const firstQuestionId = testKp.questions[0].id;

  beforeEach(() => {
    initialProgress = createInitialProgress();
  });

  it('completeQuestion - 应该正确完成一道题并增加1颗星', () => {
    const newProgress = completeQuestion(firstQuestionId, initialProgress);
    
    expect(newProgress.stars).toBe(1);
    expect(newProgress.completedQuestions[firstQuestionId]).toBe(true);
    expect(getCompletedQuestionCount(newProgress)).toBe(1);
  });

  it('completeQuestion - 重复完成同一道题不应该增加星星', () => {
    const progress1 = completeQuestion(firstQuestionId, initialProgress);
    const progress2 = completeQuestion(firstQuestionId, progress1);
    
    expect(progress2.stars).toBe(1);
  });

  it('getKnowledgePointCompletionRate - 完成一半应该返回50%', () => {
    const newProgress = completeQuestion(firstQuestionId, initialProgress);
    expect(getKnowledgePointCompletionRate(TEST_KP_ID, newProgress)).toBe(50);
  });
});

describe('Progress Logic - 完整知识点测试', () => {
  let initialProgress: ReturnType<typeof createInitialProgress>;

  beforeEach(() => {
    initialProgress = createInitialProgress();
  });

  it('completeKnowledgePointAllQuestions - 应该完成所有题目并获得正确的星星', () => {
    const newProgress = completeKnowledgePointAllQuestions(TEST_KP_ID, initialProgress);
    
    // 2题 ×1 + 完成奖励5 = 7颗星
    expect(newProgress.stars).toBe(7);
    expect(isKnowledgePointCompleted(TEST_KP_ID, newProgress)).toBe(true);
    expect(newProgress.completedKnowledgePoints).toContain(TEST_KP_ID);
    expect(newProgress.completionDetails[TEST_KP_ID]).toBeDefined();
  });

  it('getKnowledgePointCompletionRate - 完成所有题目应该返回100%', () => {
    const newProgress = completeKnowledgePointAllQuestions(TEST_KP_ID, initialProgress);
    expect(getKnowledgePointCompletionRate(TEST_KP_ID, newProgress)).toBe(100);
  });
});

describe('Progress Logic - 统计一致性测试', () => {
  let initialProgress: ReturnType<typeof createInitialProgress>;

  beforeEach(() => {
    initialProgress = createInitialProgress();
  });

  it('所有计数函数应该返回一致的结果', () => {
    const progress = completeKnowledgePointAllQuestions(TEST_KP_ID, initialProgress);
    
    const kpStats = getKnowledgePointQuestionStats(TEST_KP_ID, progress);
    const unitStats = getUnitQuestionStats(TEST_UNIT_ID, progress);
    const totalCompleted = getCompletedQuestionCount(progress);
    
    // 知识点统计应该和总完成数一致
    expect(kpStats.completed).toBe(2);
    expect(totalCompleted).toBeGreaterThanOrEqual(kpStats.completed);
    
    // 单元统计应该包含知识点的完成数
    expect(unitStats.completed).toBeGreaterThanOrEqual(kpStats.completed);
  });

  it('完成率计算应该一致', () => {
    const progress = completeKnowledgePointAllQuestions(TEST_KP_ID, initialProgress);
    
    const kpStats = getKnowledgePointQuestionStats(TEST_KP_ID, progress);
    const kpRate = getKnowledgePointCompletionRate(TEST_KP_ID, progress);
    
    const expectedRate = Math.round((kpStats.completed / kpStats.total) * 100);
    expect(kpRate).toBe(expectedRate);
  });
});

describe('Progress Logic - 边界条件测试', () => {
  let initialProgress: ReturnType<typeof createInitialProgress>;

  beforeEach(() => {
    initialProgress = createInitialProgress();
  });

  it('无效的知识点ID应该返回默认值', () => {
    const stats = getKnowledgePointQuestionStats('invalid-kp-id', initialProgress);
    expect(stats.completed).toBe(0);
    expect(stats.total).toBe(0);
    
    expect(isKnowledgePointCompleted('invalid-kp-id', initialProgress)).toBe(false);
    expect(getKnowledgePointCompletionRate('invalid-kp-id', initialProgress)).toBe(0);
  });

  it('无效的单元ID应该返回默认值', () => {
    const stats = getUnitQuestionStats('invalid-unit-id', initialProgress);
    expect(stats.completed).toBe(0);
    expect(stats.total).toBe(0);
    
    expect(isUnitCompleted('invalid-unit-id', initialProgress)).toBe(false);
    expect(getUnitCompletionRate('invalid-unit-id', initialProgress)).toBe(0);
  });

  it('对无效题目调用completeQuestion应该返回原进度', () => {
    const newProgress = completeQuestion('invalid-question-id', initialProgress);
    expect(newProgress).toEqual(initialProgress);
  });
});

describe('Progress Logic - 集成测试 - 完整用户流程', () => {
  it('模拟一个用户的完整学习流程', () => {
    let progress = createInitialProgress();
    
    // 1. 初始状态
    expect(getCompletedQuestionCount(progress)).toBe(0);
    expect(progress.stars).toBe(0);
    
    // 2. 完成第一个知识点的第一道题
    const testKp = knowledgePoints.find(kp => kp.id === TEST_KP_ID)!;
    progress = completeQuestion(testKp.questions[0].id, progress);
    
    expect(getCompletedQuestionCount(progress)).toBe(1);
    expect(progress.stars).toBe(1);
    expect(getKnowledgePointCompletionRate(TEST_KP_ID, progress)).toBe(50);
    
    // 3. 完成该知识点的所有题目
    progress = completeKnowledgePointAllQuestions(TEST_KP_ID, progress);
    
    expect(getCompletedQuestionCount(progress)).toBe(2);
    expect(progress.stars).toBe(7); // 2 + 5奖励
    expect(isKnowledgePointCompleted(TEST_KP_ID, progress)).toBe(true);
    expect(getKnowledgePointCompletionRate(TEST_KP_ID, progress)).toBe(100);
    
    // 4. 验证所有计数一致
    const kpStats = getKnowledgePointQuestionStats(TEST_KP_ID, progress);
    expect(kpStats.completed).toBe(2);
    expect(kpStats.total).toBe(2);
  });
});
