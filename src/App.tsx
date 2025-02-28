import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewGamePage from './pages/NewGamePage';
import TeamBrowserPage from './pages/TeamBrowserPage';
import LeagueManagerPage from './pages/LeagueManagerPage';
import PlayerBrowserPage from './pages/PlayerBrowserPage';
import TestPage from './pages/TestPage';
import { TeamProvider } from './store/TeamContext';
import { ConferenceProvider } from './store/ConferenceContext';
import './App.css';

const App: React.FC = () => {
  return (
    <ConferenceProvider>
      <TeamProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/new-game" element={<NewGamePage />} />
              <Route path="/teams" element={<TeamBrowserPage />} />
              <Route path="/league-manager" element={<LeagueManagerPage />} />
              <Route path="/players" element={<PlayerBrowserPage />} />
              <Route path="/test" element={<TestPage />} />
            </Routes>
          </div>
        </Router>
      </TeamProvider>
    </ConferenceProvider>
  );
};

export default App;