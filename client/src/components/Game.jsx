import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { addMove, clearMoves } from '../Actions';
import Container from './common/Container';
import Footer from './common/Footer';
import Header from './common/Header';
import './Game.scss';

const prepareBoard = (playerMoves, myId) => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce((acc, key) => {
    acc[key] = '';
    if (playerMoves[key]) {
      acc[key] = (playerMoves[key] === myId) ? 'X' : 'O';
    }
    return acc;
  }, {});
}
const Game = ({ socket }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionId = useParams().sessionId;
  const { player } = useSelector((state) => state.player);
  const { playerMoves = {} } = useSelector((state) => state.playerMoves);
  const [nextMoverId, setNextMoverId] = useState('');
  const [gameStatus, setGameStatus] = useState('');
  const [winnerId, setWinnerId] = useState('');
  const [winPattern, setWinPattern] = useState([]);
  const [opponentPlayerName, setOpponentPlayerName] = useState('')
  const myId = player?.playerId;
  const isMyTurn = myId === nextMoverId;
  const board = prepareBoard(playerMoves, myId);
  const showRematch = !!gameStatus && (gameStatus === 'win' || gameStatus === 'draw')
  const isClickable = (value) => !gameStatus && isMyTurn && !board[value];
  const onBoardClick = (move) => isClickable(move) && socket.emit('move', { sessionId, playerId: player.playerId, move });
  const onRematch = () => socket.emit('rematch', { sessionId });
  const onExit = () => {
    socket.emit('leave', { sessionId });
    navigate('/');
  };

  useEffect(() => {
    if (!player) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    socket.emit('start-game', { sessionId, playerId: myId });
    socket.on('game-start-status', (payload) => {
      dispatch(clearMoves());
      setNextMoverId(payload?.nextMoverId || '');
      setOpponentPlayerName(payload?.opponentName || '')
      socket.off('game-start-status')
    });
  }, []);

  useEffect(() => {
    socket.on('playerLeft', (payload) => {
      setGameStatus('playerLeft');
    });
    socket.on('move', (payload) => {
      setNextMoverId(payload?.nextMoverId);
      dispatch(addMove(payload.playerId, payload.move));
    });
    socket.on('win', (payload) => {
      setGameStatus('win');
      setWinnerId(payload.playerId)
      setWinPattern(payload.pattern)
    });
    socket.on('draw', () => {
      setGameStatus('draw');
    });
    socket.on('rematch', (payload) => {
      if (payload?.status) {
        setGameStatus('');
        setWinPattern([]);
        dispatch(clearMoves());
        setNextMoverId(payload?.nextMoverId || '');
        return toast.info('Rematch initiated!');
      }
      return toast.error('Failed to perform operation!');
    });

    return () => {
      socket.off('playerLeft');
      socket.off('move');
      socket.off('win');
      socket.off('draw');
      socket.off('rematch');
    };
  }, [socket])

  return (
    <div className='game'>
      <div className='actions'>
        { showRematch && <button className="uk-button uk-button-link uk-text-capitalize linkButton" onClick={onRematch}>Rematch</button> }
        <button className="uk-button uk-button-link uk-text-capitalize linkButton" onClick={onExit}>Exit</button>
      </div>
      <Header />
      <div className='contents'>
        <div className='playerInfo'>
          {(gameStatus === 'win' && winnerId === myId) && <span className='gameStatus'>Winner!</span>}
          {(gameStatus === 'draw') && <span className='gameStatus'>Draw!</span>}
          <button className={classNames("uk-button uk-text-capitalize playerButton", { myTurn: isMyTurn })}>{player?.playerName || ''}{isMyTurn ? '\'s turn' : ''}{' (You)'}</button>
        </div>
        <Container>
          <div className='board'>
            <div className='boardRow'>
              <div className={classNames('boardBox br bb', { clickable: isClickable(1), winPattern: winPattern.includes(1) })} onClick={() => onBoardClick(1)}>{board[1]}</div>
              <div className={classNames('boardBox bl br bb', { clickable: isClickable(2), winPattern: winPattern.includes(2) })} onClick={() => onBoardClick(2)}>{board[2]}</div>
              <div className={classNames('boardBox bl bb', { clickable: isClickable(3), winPattern: winPattern.includes(3) })} onClick={() => onBoardClick(3)}>{board[3]}</div>
            </div>
            <div className='boardRow'>
              <div className={classNames('boardBox bt br bb', { clickable: isClickable(4), winPattern: winPattern.includes(4) })} onClick={() => onBoardClick(4)}>{board[4]}</div>
              <div className={classNames('boardBox bl bt br bb', { clickable: isClickable(5), winPattern: winPattern.includes(5) })} onClick={() => onBoardClick(5)}>{board[5]}</div>
              <div className={classNames('boardBox bl bt bb', { clickable: isClickable(6), winPattern: winPattern.includes(6) })} onClick={() => onBoardClick(6)}>{board[6]}</div>
            </div>
            <div className='boardRow'>
              <div className={classNames('boardBox bt br', { clickable: isClickable(7), winPattern: winPattern.includes(7) })} onClick={() => onBoardClick(7)}>{board[7]}</div>
              <div className={classNames('boardBox bl bt br', { clickable: isClickable(8), winPattern: winPattern.includes(8) })} onClick={() => onBoardClick(8)}>{board[8]}</div>
              <div className={classNames('boardBox bl bt', { clickable: isClickable(9), winPattern: winPattern.includes(9) })} onClick={() => onBoardClick(9)}>{board[9]}</div>
            </div>
          </div>
        </Container>
        <div className='playerInfo'>
          {(gameStatus === 'win' && winnerId !== myId) && <span className='gameStatus'>Winner!</span>}
          {(gameStatus === 'playerLeft') && <span className='gameStatus'>Opponent left!</span>}
          <button className={classNames("uk-button uk-text-capitalize playerButton", { myTurn: !isMyTurn })}>{opponentPlayerName || 'Opponent'}{!isMyTurn ? '\'s turn' : ''}</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Game