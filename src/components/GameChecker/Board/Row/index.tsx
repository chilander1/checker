import React from 'react';
import Tile from './Tile';
import { type CheckerPieceType, type Move } from 'types';
import './style.scss';

interface RowProps {
  row: CheckerPieceType[];
  rowIndex: number;
  onCheckerClick: (
    piece: CheckerPieceType,
    owIndex: number,
    colIndex: number,
  ) => void;
  onCheckerMove: (move: Move) => void;
  selectedPiece: { row: number; col: number } | null;
  possibleMoves?: Array<{ row: number; col: number }>;
  possiblePlayerMovements: Record<string, Move[]> | null;
}

function Row({
  row,
  rowIndex,
  onCheckerClick,
  onCheckerMove,
  selectedPiece,
  possibleMoves,
  possiblePlayerMovements,
}: RowProps) {
  return (
    <div className="row">
      {row.map((piece, colIndex) => (
        <Tile
          key={`${rowIndex}-${colIndex}`}
          rowIndex={rowIndex}
          colIndex={colIndex}
          piece={piece}
          isSelected={
            !!selectedPiece &&
            selectedPiece.row === rowIndex &&
            selectedPiece.col === colIndex
          }
          selectedPiece={selectedPiece}
          onCheckerClick={onCheckerClick}
          onCheckerMove={onCheckerMove}
          possibleMoves={possibleMoves}
          possiblePlayerMovements={possiblePlayerMovements}
        />
      ))}
    </div>
  );
}

export default Row;
