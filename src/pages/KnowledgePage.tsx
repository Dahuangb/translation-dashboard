import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { knowledgePoints } from '../data/knowledgePoints';
import { useAppContext } from '../context/AppContext';
import './KnowledgePage.css';

const KnowledgePage: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const { 
    progress, 
    isKnowledgePointCompleted,
    getKnowledgePointCompletionRate,
    getKnowledgePointQuestionStats
  } = useAppContext();

  const unitKnowledgePoints = knowledgePoints.filter(kp => kp.unitId === unitId);

  if (unitKnowledgePoints.length === 0) {
    return (
      <div className="knowledge-page">
        <div className="not-found">
          <p>没有找到相关知识点</p>
          <Link to="/">返回首页</Link>
        </div>
      </div>
    );
  }

  const unit = unitKnowledgePoints[0].unitName;

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

  return (
    <div className="knowledge-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 返回
        </button>
        <h1 className="page-title">{unit}</h1>
      </div>
      <div className="knowledge-list">
        {unitKnowledgePoints.map((kp) => {
          const isCompleted = isKnowledgePointCompleted(kp.id);
          const completionRate = getKnowledgePointCompletionRate(kp.id);
          const completionDetails = progress.completionDetails[kp.id];
          const { completed, total } = getKnowledgePointQuestionStats(kp.id);
          
          return (
            <div 
              key={kp.id} 
              className={`knowledge-item animate-fade-in ${isCompleted ? 'kp-completed' : ''}`}
            >
              {isCompleted && (
                <div className="kp-corner-badge">
                  ✅ 已完成
                </div>
              )}
              <div className="kp-header">
                <div 
                  className="kp-icon" 
                  style={{ backgroundColor: isCompleted ? 'var(--color-success)' : kp.color }}
                >
                  {kp.icon}
                </div>
                <div className="kp-info">
                  <h3 className="kp-title">{kp.title}</h3>
                  <p className="kp-desc">{kp.description}</p>
                  {completionDetails && (
                    <p className="kp-completed-time">
                      ✨ 完成时间: {formatCompletedAt(completionDetails.completedAt)}
                    </p>
                  )}
                </div>
                {!isCompleted && completionRate > 0 && (
                  <div className="kp-status-badge in-progress">
                    <span className="status-icon">📖</span>
                    <span className="status-text">{completionRate}%</span>
                  </div>
                )}
              </div>
              
              {completionRate > 0 && (
                <div className="kp-progress-bar-container">
                  <div className="kp-progress-bar">
                    <div 
                      className={`kp-progress-fill ${isCompleted ? 'kp-progress-fill-completed' : ''}`}
                      style={{ 
                        width: `${completionRate}%`,
                        backgroundColor: isCompleted ? 'var(--color-success)' : kp.color 
                      }}
                    />
                  </div>
                  <span className="kp-progress-text">
                    {completed}/{total} 题
                  </span>
                </div>
              )}
              
              <div className="kp-content">
                <ul className="kp-points">
                  {kp.content.map((point, index) => (
                    <li key={index} className="kp-point">📌 {point}</li>
                  ))}
                </ul>
              </div>
              <div className="kp-actions">
                <button
                  className={`practice-btn ${isCompleted ? 'practice-btn-completed' : ''}`}
                  onClick={() => navigate(`/practice/${kp.id}`)}
                >
                  {isCompleted ? '🔄 再练一遍' : '📝 开始练习'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KnowledgePage;
