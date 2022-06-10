import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import logo from './logo.svg';
import './App.scss';

import { Home } from './views/Home';

// declare global {
//   interface Window {
//     familiarbots?: object;
//   }
// }

// window.familiarbots = {bee: []};

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
