import React from 'react';
import { useNavigate } from 'react-router-dom';
import { units, knowledgePoints } from '../data/knowledgePoints';
import { useAppContext } from '../context/AppContext';
import './AchievementPage.css';

const AchievementPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    progress, 
    resetProgress, 
    isKnowledgePointCompleted,
    getCompletedQuestionCount,
    getTotalQuestionCount,
    getUnitQuestionStats
  } = useAppContext();

  const formatCompletedAt = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalQuestions = getTotalQuestionCount();
  const completedQuestionsCount = getCompletedQuestionCount();
  const progressPercentage = totalQuestions > 0 
    ? Math.round((completedQuestionsCount / totalQuestions) * 100) 
    : 0;

  const completedKps = knowledgePoints.filter(kp => 
    progress.completionDetails[kp.id]
  );

  const getAchievementLevel = () => {
    if (progressPercentage >= 100) return { level: '数学小天才！', emoji: '🏆', color: '#FFD700' };
    if (progressPercentage >= 75) return { level: '数学小学者', emoji: '🎓', color: '#C0C0C0' };
    if (progressPercentage >= 50) return { level: '数学爱好者', emoji: '⭐', color: '#CD7F32' };
    if (progressPercentage >= 25) return { level: '数学初学者', emoji: '🌱', color: '#90EE90' };
    return { level: '数学探索者', emoji: '🚀', color: '#87CEEB' };
  };

  const achievement = getAchievementLevel();

  return (
    <div className="achievement-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 返回
        </button>
        <h1 className="page-title">🏆 我的成就</h1>
      </div>
      
      <div className="achievement-card animate-fade-in">
        <div className="achievement-level" style={{ borderColor: achievement.color }}>
          <span className="achievement-emoji">{achievement.emoji}</span>
          <h2 className="achievement-title">{achievement.level}</h2>
        </div>
        
        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-value">⭐ {progress.stars}</span>
            <span className="stat-label">收集的星星</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">✏️ {completedQuestionsCount}/{totalQuestions}</span>
            <span className="stat-label">完成的题目</span>
          </div>
        </div>

        <div className="progress-section">
          <h3 className="progress-title">学习进度</h3>
          <div className="progress-bar-container">
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="progress-percentage">{progressPercentage}%</span>
          </div>
        </div>

        {completedKps.length > 0 && (
          <div className="completed-kps-section">
            <h3 className="section-title">✅ 已完成的知识点</h3>
            <div className="completed-kps-list">
              {completedKps.map((kp) => {
                const details = progress.completionDetails[kp.id];
                return (
                  <div key={kp.id} className="completed-kp-item">
                    <div className="completed-kp-header">
                      <span className="kp-icon-small" style={{ backgroundColor: kp.color }}>
                        {kp.icon}
                      </span>
                      <div className="kp-info-small">
                        <span className="kp-title-small">{kp.title}</span>
                        <span className="kp-unit-small">{kp.unitName}</span>
                      </div>
                    </div>
                    {details && (
                      <div className="kp-details">
                        <span className="kp-stats">
                          答对: {details.correctQuestions}/{details.totalQuestions}
                        </span>
                        <span className="kp-time">
                          {formatCompletedAt(details.completedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="units-summary">
          <h3 className="units-title">各单元完成情况</h3>
          <div className="units-list">
            {units.map((unit) => {
              const { completed, total } = getUnitQuestionStats(unit.id);
              const unitProgress = total > 0 ? (completed / total) * 100 : 0;
              
              return (
                <div key={unit.id} className="unit-summary-item">
                  <div className="unit-summary-header">
                    <span className="unit-icon">{unit.icon}</span>
                    <span className="unit-name">{unit.name}</span>
                    <span className="unit-progress-text">{completed}/{total}</span>
                  </div>
                  <div className="unit-progress-bar">
                    <div 
                      className="unit-progress-fill"
                      style={{ width: `${unitProgress}%`, backgroundColor: unit.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button className="reset-btn" onClick={resetProgress}>
          🔄 重新开始
        </button>
      </div>
    </div>
  );
};

export default AchievementPage;
