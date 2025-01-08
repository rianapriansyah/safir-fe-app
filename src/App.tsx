import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { AppBar, styled, Toolbar } from '@mui/material';
import CarList from './components/cars';
import AppTheme from './theme/AppTheme';

const App: React.FC = () => {
  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

  return (
    <AppTheme>
      <Router>
      <AppBar position="fixed">
        <Toolbar>
        </Toolbar>
      </AppBar>
      <Offset />
        <Routes>
          <Route path="/cars" element={<CarList />} />
          <Route path="/" element={<CarList />} />
        </Routes>
      </Router>
    </AppTheme>
  );
};

export default App;
