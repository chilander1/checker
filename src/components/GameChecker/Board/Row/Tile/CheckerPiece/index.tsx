import React, { memo } from 'react';
import { useDrag } from 'react-dnd';
import clsx from 'clsx';
import { pieceColors } from 'constants/checker';
import './style.scss';
import { type CheckerPieceType, type Move } from 'types';

interface CheckerPieceProps {
  piece: CheckerPieceType;
  isKing: boolean;
  isSelected: boolean;
  onPieceClick: () => void;
  onCheckerMove: (move: Move) => void;
  pieceItem: Move;
  canDrag: () => boolean;
}

interface DraggableItem extends Move {
  type: string;
}

const CheckerPiece = ({
  piece,
  isKing,
  isSelected,
  onPieceClick,
  onCheckerMove,
  canDrag,
  pieceItem,
}: CheckerPieceProps) => {
  const [collected, drag] = useDrag<
    DraggableItem,
    Move,
    { isDragging: boolean }
  >(() => {
    return {
      type: 'Checker',
      item: () => {
        // onPieceClick();
        return { ...pieceItem, type: 'Checker' };
      },
      canDrag: () => {
        return canDrag();
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (_, monitor) => {
        if (monitor.didDrop()) {
          const result = monitor.getDropResult<Move>();
          if (result?.row !== undefined && result?.col !== undefined) {
            const { row, col } = result;

            onCheckerMove({ row, col });
          }

          // The item was dropped
        } else {
          console.log('The item was not dropped');
        }
      },
    };
  }, [onCheckerMove, pieceItem]);

  return (
    <div
      ref={drag}
      className={clsx('piece', pieceColors[piece], {
        selected: isSelected,
        dragging: collected.isDragging,
      })}
      onMouseDown={() => {
        onPieceClick();
      }}
    >
      {isKing && 'K'}
    </div>
  );
};

export default memo(CheckerPiece);
