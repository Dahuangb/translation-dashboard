import React from 'react';
import { units } from '../data/knowledgePoints';
import { useAppContext } from '../context/AppContext';
import KnowledgeCard from '../components/KnowledgeCard';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { isUnitCompleted } = useAppContext();

  const completedUnits = units.filter(unit => isUnitCompleted(unit.id));
  const incompleteUnits = units.filter(unit => !isUnitCompleted(unit.id));

  const renderUnitCard = (unit: typeof units[0]) => (
    <KnowledgeCard key={unit.id} unit={unit} />
  );

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="hero-title">🎉 欢迎来到数学复习乐园！</h1>
        <p className="hero-subtitle">北师大版三年级下册数学 · 全面复习</p>
      </div>

      {completedUnits.length > 0 && (
        <div className="completed-section">
          <h2 className="section-title">
            <span className="section-icon">🏆</span> 已完成的单元
            <span className="completed-count">({completedUnits.length}/{units.length})</span>
          </h2>
          <div className="units-grid">
            {completedUnits.map(renderUnitCard)}
          </div>
        </div>
      )}

      <div className="in-progress-section">
        <h2 className="section-title">
          <span className="section-icon">📚</span> 
          {incompleteUnits.length > 0 ? '继续学习' : '太棒了！全部完成！'}
        </h2>
        <div className="units-grid">
          {incompleteUnits.length > 0 ? (
            incompleteUnits.map(renderUnitCard)
          ) : (
            <div className="all-completed-message">
              <div className="all-completed-icon">🎊</div>
              <p className="all-completed-text">你已经完成了所有单元的学习！</p>
              <p className="all-completed-subtext">继续加油，成为数学小天才！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
