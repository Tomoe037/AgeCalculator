import React from 'react';
import { Capacitor } from '@capacitor/core';
import Header from './components/Header';
import AgeCalculator from './components/AgeCalculator';

function App() {


  return (
    <>
      <div className="app-container">
      <Header />
      <main>
        <AgeCalculator />
      </main>
      <footer>
        <p className="platform-info">
          Running on: {Capacitor.getPlatform()} platform
        </p>
      </footer>
    </div>
    </>
  )
}

export default App
