import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import HostGame from './components/HostGame';
import JoinGame from './components/JoinGame';
import Game from './components/Game';
import NotFound from './components/NotFound';
import io from 'socket.io-client';
import { BACKEND_URL } from './config';

const socket = io.connect(BACKEND_URL, {
  pingTimeout: 130000, // 2 min 10 sec - Increased the default value to delay the handshake request, this will reduce no of request made to spaces 
  pingInterval: 60000, // 1 min
});

const App = () => {

  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/host-game' element={<HostGame socket={socket} />}></Route>
      <Route path='/join-game' element={<JoinGame socket={socket} />}></Route>
      <Route path='/game/:sessionId' element={<Game socket={socket} />}></Route>
      <Route path='*' element={<NotFound />}></Route>
    </Routes>
  );
}

export default App;
