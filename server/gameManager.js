const { generate: generateId } = require('shortid');

const sessions = [];
const WIN_PATTERNS = [
  [1,2,3],
  [4,5,6],
  [7,8,9],
  [1,4,7],
  [2,5,8],
  [3,6,9],
  [1,5,9],
  [3,5,7],
];

const getSession = (sessionId) => {
  return sessions.find((session) => session.id === sessionId);
};

const getSessionBySocketId = (socketId) => {
  return sessions.find((session) => {
    const { player1, player2 } = session;

    return ((player1 && player1.socketId === socketId) || (player2 && player2.socketId === socketId))
  });
};

const createSession = (playerId, playerName, socketId) => {
  const id = generateId();
  const player = {
    playerId,
    playerName,
    moves: [],
    winCount: 0,
    socketId
  };
  const session = { id, player1: player };

  sessions.push(session);

  return session;
};

const deleteSession = (sessionId) => {
  let index = sessions.findIndex((session) => session.id === sessionId);
 
  if(index !== -1){
    return sessions.splice(index, 1)[0];
  }
}

const joinSession = (sessionId, playerId, playerName, socketId) => {
  const session = getSession(sessionId)

  if (!session || session.player2) {
    return;
  }
  const player = {
    playerId,
    playerName,
    moves: [],
    winCount: 0,
    socketId
  };
  session.player2 = player

  return session;
};

const startGame = (sessionId) => {
  const session = getSession(sessionId)

  if (!session || !session.player1 || !session.player2) {
    return;
  }
  const { player1, player2 } = session;

  if (!session.nextMoverId) {
    session.nextMoverId = (Math.floor(Math.random() * 10) % 2) ? player1.playerId : player2.playerId;
  }

  return session.nextMoverId;
}

const makeMove = (sessionId, playerId, move) => {
  const session = getSession(sessionId);

  if (session) {
    const { player1, player2 } = session;
    const player = (player1.playerId === playerId) ? player1 : player2;

    player.moves.push(move);
    session.nextMoverId = (player1.playerId === playerId) ? player2.playerId : player1.playerId;
    
    return {
      status: true,
      nextMoverId: session.nextMoverId
    };
  }

  return { status: false };
};

const hasMatchWithWinPatterns = (moves) => {
  let hasMatch = false;
  let pattern;

  if (moves && moves.length >= 3) {
    for (let index = 0; index < WIN_PATTERNS.length; index++) {
      const winPattern = WIN_PATTERNS[index];
      
      hasMatch = winPattern.every((move) => moves.includes(move));

      if (hasMatch) {
        pattern = [...winPattern];
        break;
      }
    }
  }
  
  return { hasMatch, pattern };
};

const isMatchDraw = (p1Moves, p2Moves) => {
  let isDraw = false;

  if (p1Moves && p2Moves) {
    isDraw = (p1Moves.length + p2Moves.length) === 9 
  }

  return isDraw;
};

const checkGameStatus = (sessionId) => {
  const session = getSession(sessionId);

  if (session) {
    const { player1, player2 } = session;
    let matchCheck;

    matchCheck = hasMatchWithWinPatterns(player1.moves);
    if (matchCheck.hasMatch) {
      player1.winCount++;

      return {
        isWin: true,
        winner: player1,
        pattern: matchCheck.pattern,
      };
    }

    matchCheck = hasMatchWithWinPatterns(player2.moves);
    if (matchCheck.hasMatch) {
      player2.winCount++;

      return {
        isWin: true,
        winner: player2,
        pattern: matchCheck.pattern,
      };
    }

    if (isMatchDraw(player1.moves, player2.moves)) {
      return { isDraw: true };
    }
  }
};

const rematch = (sessionId) => {
  const session = getSession(sessionId);

  if (session && session.player1 && session.player2) {
    const { player1, player2 } = session;
    
    player1.moves = [];
    player2.moves = [];
    session.nextMoverId = (Math.floor(Math.random() * 10) % 2) ? player1.playerId : player2.playerId;

    return session.nextMoverId;
  }

  return false;
}

const leaveSession = (socketId) => {
  const session = getSessionBySocketId(socketId);

  if (session) {
    const { id, player1, player2 } = session;

    if (player1 && player1.socketId === socketId) {
      deleteSession(id)
      return id;
    }
    if (player2 && player2.socketId === socketId) {
      delete session.player2;
      return id;
    }
  }
}

const getOpponentPlayer = (sessionId, playerId)=> {
  const session = getSession(sessionId);

  if (!session) {
    return;
  }
  const { player1, player2 } = session;

  return (player1.playerId === playerId) ? player2 : player1;
}

module.exports = {
  createSession,
  deleteSession,
  joinSession,
  startGame,
  makeMove,
  checkGameStatus,
  rematch,
  leaveSession,
  getOpponentPlayer,
};
