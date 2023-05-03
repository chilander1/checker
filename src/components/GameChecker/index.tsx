import React, { useState, useReducer, useCallback, useEffect } from 'react';

import { applyMove, generateLegalMovesForPlayer } from 'utils';
import { type CheckerPieceType } from 'types';
import { saveStateToLocalStorage } from 'utils/localStorage';
import Header from './Header';
import Board from './Board';
import VictoryPopup from './VictoryPopup';
import { reducer, getInitialState } from './reducer';

const Game = () => {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
  const {
    board,
    selectedPiece,
    activePlayer,
    possiblePlayerMovements,
    score,
    stats,
  } = state;
  const [showVictoryPopup, setShowVictoryPopup] = useState(false);

  useEffect(() => {
    const legalMovesByPiece = generateLegalMovesForPlayer(board, activePlayer);
    dispatch({
      type: 'SET_POSSIBLE_PLAYER_MOVEMENTS',
      possiblePlayerMovements: legalMovesByPiece,
    });
  }, [board, activePlayer]);

  useEffect(() => {
    if (stats.isOver && stats.winner) {
      setShowVictoryPopup(true);
    }
  }, [stats]);

  useEffect(() => {
    saveStateToLocalStorage(state);
  }, [state]);

  const handleSquareClick = useCallback(
    (piece: CheckerPieceType, row: number, col: number) => {
      const obj = `${row},${col}`;
      if (possiblePlayerMovements && possiblePlayerMovements[obj]?.length > 0) {
        dispatch({ type: 'SET_SELECTED_PIECE', selectedPiece: { row, col } });
      } else {
        dispatch({ type: 'SET_SELECTED_PIECE', selectedPiece: null });

        console.log(`The move is not valid!`);
      }
    },
    [possiblePlayerMovements],
  );

  const handleMove = useCallback(
    (moveTo: { row: number; col: number }) => {
      const { row, col } = selectedPiece ?? {};
      if (row !== undefined && col !== undefined) {
        const updates = applyMove(board, { row, col }, moveTo);

        dispatch({
          type: 'APPLY_MOVE',
          board: updates.newBoard,
          score:
            updates.captured > 0
              ? { player: activePlayer, update: updates.captured }
              : null,
          activePlayer: activePlayer === 1 ? 2 : 1,
        });
      }
    },
    [selectedPiece, activePlayer, board],
  );

  const handleReset = () => {
    dispatch({
      type: 'RESET',
    });
  };
  const handleCloseVictoryPopup = () => {
    setShowVictoryPopup(false);
    handleReset();
  };

  return (
    <>
      <Header
        activePlayer={activePlayer}
        score={score}
        isGameEnded={stats.isOver}
        onReset={handleReset}
      />
      <Board
        data-testid="game-board"
        board={board}
        onCheckerClick={handleSquareClick}
        onCheckerMove={handleMove}
        possiblePlayerMovements={possiblePlayerMovements}
        selectedPiece={selectedPiece}
      />

      {showVictoryPopup && stats.winner && (
        <VictoryPopup winner={stats.winner} onClose={handleCloseVictoryPopup} />
      )}
    </>
  );
};

export default Game;
