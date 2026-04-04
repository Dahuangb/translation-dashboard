import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import KnowledgePage from './pages/KnowledgePage';
import PracticePage from './pages/PracticePage';
import AchievementPage from './pages/AchievementPage';
import './styles/colors.css';
import './styles/global.css';
import './App.css';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/unit/:unitId" element={<KnowledgePage />} />
              <Route path="/practice/:kpId" element={<PracticePage />} />
              <Route path="/achievement" element={<AchievementPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
