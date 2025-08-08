import React, { useState } from 'react';
import './App.css';

/*
  Modern, Minimalistic Tic Tac Toe App
  - 3x3 interactive board
  - Turn indicator
  - Win/draw detection
  - Restart button
  - Responsive, centered layout
  - Light modern theme, custom colors as per requirements
*/

/* --- Color Theme Constants --- */
const PRIMARY_COLOR = '#1e88e5';
const SECONDARY_COLOR = '#42a5f5';
const ACCENT_COLOR = '#ffeb3b';

/**
 * Returns the winner ("X"|"O"|null) and winning line, or null if no winner.
 * @param {string[]} squares
 * @returns {{winner: string, line: number[]}|null}
 */
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /**
   * This is a public function: it checks all win conditions on the 3x3 board
   */
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6]  // diagonals
  ];
  for (const [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Simple functional Square component.
 */
function Square({ value, onClick, highlight, disabled }) {
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Cell ${value}` : 'Empty cell'}
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board displays the grid and accepts moves
 */
function Board({ squares, onSquareClick, winningLine, isGameOver }) {
  /**
   * Render 3x3 board with minimal CSS, highlighting winning squares if any.
   */
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((val, idx) => (
        <Square
          key={idx}
          value={val}
          onClick={() => onSquareClick(idx)}
          highlight={winningLine && winningLine.includes(idx)}
          disabled={!!val || isGameOver}
        />
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Main App component and game logic.
 */
function App() {
  // 'X' goes first by default
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState([]); // Simple array for possible extensibility

  // Compute winner and winning line
  const winResult = calculateWinner(squares);
  const isBoardFull = squares.every(Boolean);

  let status = "";
  if (winResult) {
    status = `Winner: ${winResult.winner}`;
  } else if (isBoardFull) {
    status = "Draw!";
  } else {
    status = `Next turn: ${isXNext ? 'X' : 'O'}`;
  }

  React.useEffect(() => {
    if (winResult || isBoardFull) setGameOver(true);
    else setGameOver(false);
  }, [squares, winResult, isBoardFull]);

  // PUBLIC_INTERFACE
  const handleSquareClick = idx => {
    // No move if already filled or game has ended
    if (squares[idx] || gameOver) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = isXNext ? 'X' : 'O';
    setSquares(nextSquares);
    setIsXNext(!isXNext);
    setHistory([...history, nextSquares]);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setHistory([]);
  };

  return (
    <div className="tic-tac-toe-app">
      {/* --- Header --- */}
      <header className="ttt-header">
        <h1>Tic Tac Toe</h1>
      </header>
      {/* --- Board --- */}
      <main>
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winResult ? winResult.line : null}
          isGameOver={gameOver}
        />
        {/* --- Turn Indicator and Status --- */}
        <div className="ttt-status-panel">
          <span
            className={`ttt-status${status.startsWith("Winner") ? ' ttt-status-winner' : status === "Draw!" ? ' ttt-status-draw' : ''}`}
            aria-label={status}
          >
            {status}
          </span>
        </div>
        {/* --- Controls --- */}
        <div className="ttt-controls">
          <button className="ttt-btn" onClick={handleRestart} aria-label="Restart game">
            Restart
          </button>
        </div>
      </main>
      {/* Footer credit for minimalism */}
      <footer className="ttt-footer">
        <span>Modern Tic Tac Toe &middot; React</span>
      </footer>
    </div>
  );
}

export default App;
