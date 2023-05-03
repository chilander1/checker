import { type GameState } from 'types';

export function saveStateToLocalStorage(state: GameState) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('gameState', serializedState);
  } catch (error) {
    console.error('Error saving state to local storage:', error);
  }
}

export function loadStateFromLocalStorage(): GameState | undefined {
  try {
    const serializedState = localStorage.getItem('gameState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Error loading state from local storage:', error);
    return undefined;
  }
}
