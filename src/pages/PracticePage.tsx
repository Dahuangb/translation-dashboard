import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { knowledgePoints } from '../data/knowledgePoints';
import { useAppContext } from '../context/AppContext';
import QuestionCard from '../components/QuestionCard';
import './PracticePage.css';

const PracticePage: React.FC = () => {
  const { kpId } = useParams<{ kpId: string }>();
  const navigate = useNavigate();
  const { recordCompletion } = useAppContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSessionCorrectCount, setCurrentSessionCorrectCount] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const kp = knowledgePoints.find(k => k.id === kpId);

  if (!kp) {
    return (
      <div className="practice-page">
        <div className="not-found">
          <p>没有找到相关练习</p>
          <button onClick={() => navigate('/')}>返回首页</button>
        </div>
      </div>
    );
  }

  const questions = kp.questions;

  const [finalCorrectCountToShow, setFinalCorrectCountToShow] = useState(0);

  const handleQuestionComplete = (isCorrect: boolean) => {
    const newCorrectCount = isCorrect 
      ? currentSessionCorrectCount + 1 
      : currentSessionCorrectCount;

    if (currentQuestionIndex < questions.length - 1) {
      if (isCorrect) {
        setCurrentSessionCorrectCount(prev => prev + 1);
      }
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setFinalCorrectCountToShow(newCorrectCount);
      recordCompletion(kp.id);
      setShowCompletion(true);
    }
  };

  const handleContinue = () => {
    navigate(`/unit/${kp.unitId}`);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="practice-page">
      <div className="practice-header">
        <button className="back-btn" onClick={() => navigate(`/unit/${kp.unitId}`)}>
          ← 返回
        </button>
        <div className="practice-info">
          <h1 className="practice-title">{kp.title}</h1>
          <p className="practice-progress">
            第 {currentQuestionIndex + 1} 题 / 共 {questions.length} 题
            {!showCompletion && currentSessionCorrectCount > 0 && (
              <span className="current-score"> (当前答对: {currentSessionCorrectCount})</span>
            )}
          </p>
        </div>
      </div>

      {showCompletion ? (
        <div className="completion-modal animate-fade-in">
          <div className="completion-content">
            <div className="completion-icon">🎉</div>
            <h2 className="completion-title">恭喜完成练习！</h2>
            <p className="completion-stats">
              答对: {finalCorrectCountToShow} / {questions.length} 题
            </p>
            <p className="completion-message">你真棒！继续加油！</p>
            <button className="completion-btn" onClick={handleContinue}>
              继续学习 →
            </button>
          </div>
        </div>
      ) : (
        questions.length > 0 && (
          <QuestionCard
            question={currentQuestion}
            onComplete={handleQuestionComplete}
          />
        )
      )}
    </div>
  );
};

export default PracticePage;
