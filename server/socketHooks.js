const { createSession, joinSession, makeMove, checkGameStatus, rematch, startGame, getOpponentPlayer, deleteSession, leaveSession } = require('./gameManager');

const initializeSocketHooks = (io) => {
  io.on('connection', (client) => {

    client.on('create', (payload) => {
      const { playerId, playerName } = payload;
      const session = createSession(playerId, playerName, client.id);
      
      client.join(session.id);

      client.emit('message', { created: true, sessionId: session.id });
    });

    client.on('join', (payload) => {
      const { sessionId, playerId, playerName } = payload;
      const session = joinSession(sessionId, playerId, playerName, client.id);

      if (!session) {
        client.emit('message', { error: 'Session does not exists or full' });
        return;
      }
      client.join(session.id);
      client.emit('message', { joined: true, sessionId: session.id });
      client.to(session.id).emit('playerJoined', { playerName, joined: true });
    });

    client.on('start-game', (payload) => {
      const { sessionId, playerId } = payload;
      const nextMoverId = startGame(sessionId)
      const opponentPlayer = getOpponentPlayer(sessionId, playerId)

      if (!nextMoverId) {
        io.in(sessionId).emit('message', { error: 'Failed to start the game' });
        return;
      }
      io.in(sessionId).emit('game-start-status', { sessionId, nextMoverId, opponentName: opponentPlayer.playerName });
    })

    client.on('move', (payload) => {
      const { sessionId, playerId, move } = payload;
      const { status, nextMoverId} = makeMove(sessionId, playerId, move);
      
      if (!status) {
        io.in(sessionId).emit('message', { error: 'Unable to perform'});
        return;
      }

      io.in(sessionId).emit('move', { playerId, move, nextMoverId, sessionId });

      const gameStatus = checkGameStatus(sessionId);

      if (gameStatus) {
        const { isWin, isDraw, winner, pattern } = gameStatus;

        if (isWin) {
          const winnerPayload = {
            playerId: winner.playerId,
            playerName: winner.playerName,
            pattern,
            sessionId
          };
          io.in(sessionId).emit('win', winnerPayload);
          return;
        }

        if (isDraw) {
          io.in(sessionId).emit('draw', { draw: true, sessionId });
        }
      }
    });

    client.on('rematch', (payload) => {
      const { sessionId } = payload;
      const nextMoverId = rematch(sessionId);
      
      io.in(sessionId).emit('rematch', { sessionId, status: !!nextMoverId, nextMoverId });
    });

    client.on('leave', () => {
      const sessionId = leaveSession(client.id);
      io.in(sessionId).emit('playerLeft', { sessionId });
    })

    client.on('disconnect', () => {
      const sessionId = leaveSession(client.id);
      io.in(sessionId).emit('playerLeft', { sessionId });
    })

  })
}

module.exports = {
  initializeSocketHooks,
};
