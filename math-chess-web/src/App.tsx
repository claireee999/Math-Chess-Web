import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  const handleStartGame = () => {
    // Logic to start the game
    console.log('Game started!');
  };

  return (
      <div>
        <HomePage onStartGame={handleStartGame} />
      </div>
  );
};

export default App;

