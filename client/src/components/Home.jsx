
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { generate } from 'shortid';
import { toast } from 'react-toastify';
import { addPlayer } from '../Actions';
import Container from './common/Container';
import Footer from './common/Footer';
import Header from './common/Header';
import './Home.scss';

const GetPlayerName = () => {
  const playerId = generate();
  const [playerName, setPlayerName] = useState('')
  const dispatch = useDispatch();
  const onSetClick = () => {
    if (!playerName) {
      return toast.error('Please enter your name!');
    }
    dispatch(addPlayer(playerId, playerName));
  }

  return (
    <>
      <div className='titleSection'>
        <span className='title'>Add your name</span>
      </div>
      <div className='contents'>
        <div className='controls'>
          <input className="uk-input nameField" type="text" placeholder='Player name' value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          <button className="uk-button uk-button-secondary uk-text-capitalize setButton" onClick={onSetClick}>Set</button>
        </div>
      </div>
    </>
  )
};

const Options = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className='titleSection'>
        <span className='title'>Multiplayer</span>
      </div>
      <div className='contents'>
        <button className="uk-button uk-button-secondary uk-text-capitalize hostButton" onClick={() => navigate('/host-game')}>Host a game</button>
        <button className="uk-button uk-button-secondary uk-text-capitalize joinButton" onClick={() => navigate('/join-game')}>Join a game</button>
      </div>
    </>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search)
  const sessionId = query.get('join');
  const { player } = useSelector((state) => state.player);
  const hasPlayerId = !!player?.playerId;

  useEffect(() => {
    if (hasPlayerId && sessionId) {
      navigate(`/join-game?sessionId=${sessionId}`);
    }
  }, [hasPlayerId, sessionId]);

  return (
    <div className='home'>
      <Header />
      <Container>
        {!hasPlayerId && <GetPlayerName />}
        {hasPlayerId && <Options />}
      </Container>
      <Footer />
    </div>
  )
}

export default Home;