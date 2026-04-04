import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './Header.css';

const Header: React.FC = () => {
  const { progress, showStarAnimation } = useAppContext();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          🎓 数学复习乐园
        </Link>
        <div className="header-right">
          <div className="stars-display">
            {showStarAnimation && (
              <div className="flying-stars">
                <span className="flying-star flying-star-1">⭐</span>
                <span className="flying-star flying-star-2">⭐</span>
                <span className="flying-star flying-star-3">⭐</span>
              </div>
            )}
            <span className="star-icon">⭐</span>
            <span className={`stars-count ${showStarAnimation ? 'animate-pulse' : ''}`}>{progress.stars}</span>
          </div>
          <Link to="/achievement" className="achievement-btn">
            🏆 成就
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
