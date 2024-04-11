import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from './common/Header'
import Container from './common/Container'
import Footer from './common/Footer';
import './JoinGame.scss'

const JoinGame = ({ socket }) => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search)
  const { player } = useSelector((state) => state.player);
  const [sessionId, setSessionId] = useState(query.get('sessionId') || '');
  const [joined, setJoined] = useState(false);
  const onJoinClick = () => {
    const { playerId, playerName } = player;

    socket.emit('join', { playerId, playerName, sessionId });
  };
  const onStart = () => {
    navigate(`/game/${sessionId}`);
  };

  useEffect(() => {
    if (!player) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    socket.on('message', (payload) => {
      if (payload?.error) {
        return toast.error(payload?.error);
      }
      setJoined(payload?.joined || false);
    });
    socket.on('playerLeft', () => {
      toast.info('Host left!');
      setJoined(false);
    })
    socket.on('game-start-status', (payload) => {
      navigate(`/game/${payload?.sessionId}`);
    });

    return () => {
      socket.off('message');
      socket.off('playerLeft');
      socket.off('game-start-status');
    };
  }, [socket])

  return (
    <div className='joinGame'>
      <Header />
      <Container>
        <div className='titleSection'>
          <span className='title'>Multiplayer</span>
        </div>
        <div className='contents'>
          <span className='invitaion'>Enter session ID to join a game</span>
          <div className='sessionHolder'>
            <input className="uk-input sessionIdField" type="text" value={sessionId} onChange={(e) => setSessionId(e.target.value)} />
            <button className="uk-button uk-button-secondary uk-text-capitalize joinGameButton" onClick={onJoinClick} disabled={joined}>Join</button>  
          </div>
          <span className='sessionJoined'>Session joined:</span>
          <span className='sessionId'>{(joined && sessionId) || 'none'}</span>
          <button className="uk-button uk-button-secondary uk-text-capitalize startGameButton" onClick={onStart} disabled={!joined}>Start game</button>
        </div>
      </Container>
      <Footer />
    </div>
  )
}

export default JoinGame