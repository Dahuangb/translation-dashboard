import React, { useState } from 'react';
import { Question } from '../types';
import { useAppContext } from '../context/AppContext';
import './QuestionCard.css';

interface QuestionCardProps {
  question: Question;
  onComplete?: (isCorrect: boolean) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { completeQuestion } = useAppContext();
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === question.correctAnswer;
    setIsCurrentAnswerCorrect(correct);
    setShowResult(true);
    if (correct) {
      setShowCelebration(true);
      completeQuestion(question.id);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowCelebration(false);
    onComplete?.(isCurrentAnswerCorrect);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="question-card animate-fade-in">
      {showCelebration && (
        <div className="celebration-overlay">
          <span className="celebration-star star-1">⭐</span>
          <span className="celebration-star star-2">🌟</span>
          <span className="celebration-star star-3">✨</span>
          <span className="celebration-star star-4">⭐</span>
          <span className="celebration-star star-5">🌟</span>
        </div>
      )}
      <h3 className="question-text">{question.text}</h3>
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${
              selectedAnswer === index ? 'selected' : ''
            } ${showResult ? (index === question.correctAnswer ? 'correct' : index === selectedAnswer ? 'wrong' : '') : ''}`}
            onClick={() => handleAnswerSelect(index)}
            disabled={showResult}
          >
            {String.fromCharCode(65 + index)}. {option}
          </button>
        ))}
      </div>
      {showResult && (
        <div className={`result-message ${isCorrect ? 'success' : 'error'}`}>
          <span className={`result-icon ${isCorrect ? 'animate-bounce' : ''}`}>{isCorrect ? '🎉' : '😢'}</span>
          <span className="result-text">
            {isCorrect ? '太棒了！答对了！' : '再想想哦～'}
          </span>
          {question.explanation && (
            <p className="explanation">{question.explanation}</p>
          )}
        </div>
      )}
      <div className="question-actions">
        {!showResult ? (
          <button
            className="check-btn"
            onClick={handleCheck}
            disabled={selectedAnswer === null}
          >
            ✓ 确定
          </button>
        ) : (
          <button className="next-btn" onClick={handleNext}>
            下一题 →
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
