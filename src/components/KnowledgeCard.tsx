import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Unit } from '../types';
import { useAppContext } from '../context/AppContext';
import './KnowledgeCard.css';

interface KnowledgeCardProps {
  unit: Unit;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ unit }) => {
  const navigate = useNavigate();
  const { isUnitCompleted, getUnitCompletionRate, getUnitQuestionStats } = useAppContext();
  
  const isCompleted = isUnitCompleted(unit.id);
  const completionRate = getUnitCompletionRate(unit.id);
  const { completed, total } = getUnitQuestionStats(unit.id);

  return (
    <div 
      className={`knowledge-card animate-fade-in ${isCompleted ? 'card-completed' : ''}`}
      onClick={() => navigate(`/unit/${unit.id}`)}
      style={{ borderColor: isCompleted ? 'var(--color-success)' : unit.color }}
    >
      {isCompleted && (
        <div className="completion-overlay">
          <span className="completion-check">✓</span>
        </div>
      )}
      <div className="card-icon" style={{ backgroundColor: isCompleted ? 'var(--color-success)' : unit.color }}>
        <span className="icon-text">{unit.icon}</span>
      </div>
      <h3 className="card-title">{unit.name}</h3>
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className={`progress-fill ${isCompleted ? 'progress-fill-completed' : ''}`}
            style={{ width: `${completionRate}%`, backgroundColor: isCompleted ? 'var(--color-success)' : unit.color }}
          />
        </div>
        <span className="progress-text">{completed}/{total} 题</span>
      </div>
      {isCompleted && (
        <div className="completed-badge animate-pulse">
          ✅ 已全部完成
        </div>
      )}
      {!isCompleted && completionRate > 0 && completionRate < 100 && (
        <div className="in-progress-badge">
          📖 进行中 {completionRate}%
        </div>
      )}
    </div>
  );
};

export default KnowledgeCard;
