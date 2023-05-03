import React, { memo, useMemo, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import clsx from 'clsx';
import { type CheckerPieceType, type Move } from 'types';
import CheckerPiece from './CheckerPiece';
import './style.scss';

interface TileProps {
  piece: CheckerPieceType;
  rowIndex: number;
  colIndex: number;
  isSelected?: boolean;
  onCheckerClick: (
    piece: CheckerPieceType,
    rowIndex: number,
    colIndex: number,
  ) => void;
  onCheckerMove: (move: Move) => void;
  possibleMoves?: Array<{ row: number; col: number }>;
  possiblePlayerMovements: Record<string, Move[]> | null;
  selectedPiece: { row: number; col: number } | null;
}

interface DraggableItem {
  row: number;
  col: number;
}

const Tile = ({
  piece,
  rowIndex,
  colIndex,
  isSelected,
  onCheckerClick,
  onCheckerMove,
  possiblePlayerMovements,
  selectedPiece,
}: TileProps) => {
  const [collectedProps, drop] = useDrop(
    () => ({
      accept: 'Checker',
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        hovered: monitor.isOver(),
      }),
      canDrop: (item: DraggableItem) => {
        return isDroppableSquare(item, true);
      },
      drop: () => {
        return { row: rowIndex, col: colIndex };
      },
    }),
    [possiblePlayerMovements],
  );

  const colorClass = useMemo(
    () => (rowIndex % 2 === colIndex % 2 ? 'light' : 'dark'),
    [rowIndex, colIndex],
  );

  const handleClick = useCallback(() => {
    if (piece > 0) {
      onCheckerClick(piece, rowIndex, colIndex);
    }
  }, [onCheckerClick, piece, rowIndex, colIndex]);

  const canDrag = useCallback(() => {
    const obj = `${rowIndex},${colIndex}`;
    if (
      possiblePlayerMovements?.[obj] &&
      possiblePlayerMovements[obj].length > 0
    ) {
      return true;
    }
    return false;
  }, [rowIndex, colIndex, possiblePlayerMovements]);

  const isMoveInChain = (move: Move, extraCheck = true): boolean => {
    const isLastMove = !extraCheck || !move.next;
    const isCurrentMove = move.row === rowIndex && move.col === colIndex;

    if (isLastMove && isCurrentMove) {
      return true;
    }

    return move.next ? isMoveInChain(move.next, extraCheck) : false;
  };

  const isDroppableSquare = (
    item: DraggableItem,
    checkForLastMove: boolean,
  ) => {
    if (item && possiblePlayerMovements) {
      const obj = `${item.row},${item.col}`;
      const moves = possiblePlayerMovements[obj];

      if (!moves || moves.length === 0) {
        return false;
      }

      return moves.some((moveItem) =>
        isMoveInChain(moveItem, checkForLastMove),
      );
    }

    return false;
  };

  return (
    <div
      ref={drop}
      className={clsx('tile', colorClass, {
        canDrop: collectedProps.canDrop,
        possibleDrop: selectedPiece && isDroppableSquare(selectedPiece, false),
      })}
    >
      {piece > 0 && (
        <CheckerPiece
          canDrag={canDrag}
          piece={piece}
          isSelected={!!isSelected}
          isKing={piece === 3 || piece === 4}
          onPieceClick={handleClick}
          onCheckerMove={onCheckerMove}
          pieceItem={{ row: rowIndex, col: colIndex }}
        />
      )}
    </div>
  );
};

export default memo(Tile);
