import React from 'react';
import { type CheckerPieceType, type Move } from 'types';
import Row from './Row';
import './style.scss';

interface BoardProps {
  board: CheckerPieceType[][];
  onCheckerClick: (piece: CheckerPieceType, row: number, col: number) => void;
  onCheckerMove: (moveTo: { row: number; col: number }) => void;
  possiblePlayerMovements: Record<string, Move[]> | null;
  selectedPiece: {
    row: number;
    col: number;
    possibleMoves?: Array<{ row: number; col: number }>;
  } | null;
}

const Board = ({
  board,
  onCheckerClick,
  onCheckerMove,
  possiblePlayerMovements,
  selectedPiece,
}: BoardProps) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <Row
          key={rowIndex}
          rowIndex={rowIndex}
          row={row}
          selectedPiece={selectedPiece}
          onCheckerClick={onCheckerClick}
          onCheckerMove={onCheckerMove}
          possiblePlayerMovements={possiblePlayerMovements}
        />
      ))}
    </div>
  );
};

export default Board;
