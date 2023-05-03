import React from 'react';
import { Player } from 'types';
import './style.scss';

interface VictoryPopupProps {
  winner: Player;
  onClose: () => void;
}

const PlayerNames = {
  [Player.WHITE]: 'WHITE',
  [Player.BLACK]: 'BLACK',
};

const VictoryPopup: React.FC<VictoryPopupProps> = ({ winner, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Congratulations!</h2>
        <p>
          The <b>{PlayerNames[winner]}</b> player has won the game!
        </p>
        <button onClick={onClose} className="btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default VictoryPopup;
