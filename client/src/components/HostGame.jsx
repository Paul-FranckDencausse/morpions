import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CopyIcon from '../asserts/copy.svg';
import Container from './common/Container';
import Footer from './common/Footer';
import Header from './common/Header';
import './HostGame.scss';

const HostGame = ({ socket }) => {
  const navigate = useNavigate();
  const { player } = useSelector((state) => state.player);
  const [sessionId, setSessionId] = useState('');
  const [opponentPlayer, setOpponentPlayer] = useState('');
  const onCopyClick = () => {
    navigator.clipboard.writeText(`${document.location.origin}?join=${sessionId}`);
    toast.info('Copied');
  }
  const onStart = () => {
    navigate(`/game/${sessionId}`);
  };

  useEffect(() => {
    if (!player) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    const { playerId, playerName } = player;

    socket.emit('create', { playerId, playerName });
    socket.on('message', (payload) => {
      if (payload?.created) {
        setSessionId(payload?.sessionId || '');
      }
    });
    socket.on('playerJoined', (payload) => {
      if (payload?.joined) {
        toast.info('Opponent joined!')
        setOpponentPlayer(payload?.playerName );
      }
    })
    socket.on('playerLeft', () => {
      toast.info('Opponent left!');
      setOpponentPlayer('');
    })
    socket.on('game-start-status', (payload) => {
      navigate(`/game/${payload?.sessionId}`);
    });

    return () => {
      socket.off('message');
      socket.off('playerJoined');
      socket.off('playerLeft');
      socket.off('game-start-status');
    };
  }, [socket]);

  return (
    <div className='hostGame'>
      <Header />
      <Container>
        <div className='titleSection'>
          <span className='title'>Multiplayer</span>
        </div>
        <div className='contents'>
          <span className='invitation'>Share the session ID to invite a friend</span>
          <div className='sessionHolder'>
            <input className="uk-input sessionIdField" type="text" value={sessionId} disabled />
            <img className='copyIcon' src={CopyIcon} onClick={onCopyClick} />
          </div>
          <span className='playerJoined'>Player's joined</span>
          <span className='opponent'>{ opponentPlayer || 'none' }</span>
          <button className="uk-button uk-button-secondary uk-text-capitalize startGameButton" onClick={onStart} disabled={!opponentPlayer}>Start game</button>
        </div>
      </Container>
      <Footer />
    </div>
  )
}

export default HostGame