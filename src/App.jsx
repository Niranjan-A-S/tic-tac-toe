/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { memo, useCallback, useState, useMemo } from "react";
import './App.css';

const winningCombinations = new Set([
  '012', '345', '678',
  '036', '147', '258',
  '048', '246',
])

const calculateWinner = (squares) => {
  for (const [a, b, c] of winningCombinations) {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }
}

const initialBoard = Array(9).fill(null);

const Square = memo(({ value, fillValue, index }) => {
  const onClick = useCallback(() => fillValue(index), [fillValue, index])
  return <button onClick={onClick}>{value}</button>
});

const Board = memo(({ squares, xIsNext, handlePlay, resetGame }) => {

  const fillValue = useCallback((index) => {
    if (squares[index] || calculateWinner(squares)) {
      return;
    }
    const clone = [...squares];
    clone[index] = xIsNext ? 'X' : 'O';
    handlePlay(clone)
  }, [handlePlay, squares, xIsNext]);

  const renderSquare = useCallback((value, index) => <Square value={value} fillValue={fillValue} index={index} key={index} />, [fillValue]);

  const winner = useMemo(() => calculateWinner(squares), [squares])
  const status = useMemo(() => winner ? `Winner: ${winner}` : `Next Player: ${xIsNext ? 'X' : 'O'}`, [winner, xIsNext]);

  return (
    <>
      <div className="board">
        {squares.map(renderSquare)}
      </div>
      <h3>{status}</h3>
      <button onClick={resetGame}>Reset</button>
    </>

  )
});

const Move = memo(({ move, jumpTo }) => {
  const description = useMemo(() => move === 0 ? 'game start' : `#${move}`, [move])
  return <button onClick={() => jumpTo(move)}>Go to{description}</button>
})


const Game = memo(() => {

  const [history, setHistory] = useState([initialBoard]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = useMemo(() => currentMove % 2 === 0, [currentMove])
  const lastSquares = useMemo(() => history[currentMove], [currentMove, history]);

  const onPlay = useCallback((nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }, [currentMove, history]);

  const resetGame = useCallback(() => {
    setHistory([initialBoard]);
    setCurrentMove(0);
  }, []);

  const jumpTo = useCallback((nextMove) => {
    setCurrentMove(nextMove);
  }, [])

  const renderMove = useCallback((squares, index) => <Move move={index} key={index} jumpTo={jumpTo} />, [jumpTo]);

  return (
    <>
      <Board squares={lastSquares} xIsNext={xIsNext} handlePlay={onPlay} resetGame={resetGame} />
      {history.map(renderMove)}
    </>
  );
})

export default Game;
