import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import GameChecker from 'components/GameChecker';
import './App.scss';

function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <GameChecker />
      </DndProvider>
    </div>
  );
}

export default App;
