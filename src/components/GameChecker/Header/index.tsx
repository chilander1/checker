import React from 'react';
import { type Player, type Score } from 'types';
import Timer from './Timer';

import './style.scss';

interface HeaderProps {
  activePlayer: Player;
  score: Score;
  isGameEnded: boolean;
  onReset: () => void;
}

const playerType = {
  1: 'White',
  2: 'Black',
};

const Header = ({ activePlayer, score, isGameEnded, onReset }: HeaderProps) => {
  return (
    <div className="header">
      <div>
        <Timer isGameEnded={isGameEnded} />
      </div>
      <div className="active">
        Active player: <b>{playerType[activePlayer]}</b>
      </div>

      <div className="score">
        <div>
          <b>{playerType[1]}:</b>
          {score[1]}
        </div>

        <div>
          <b>{playerType[2]}:</b>
          {score[2]}
        </div>
      </div>
      <button onClick={onReset} className="btn reset" type="reset">
        ↺
      </button>
    </div>
  );
};

export default Header;
