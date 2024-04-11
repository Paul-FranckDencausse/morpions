export const addPlayer = (playerId, playerName) => async (dispatch) => {
  dispatch({
    type: "AddPlayer",
    payload: { playerId, playerName }
  })
};

export const setErrorMessage = (message) => async (dispatch) => {
  dispatch({
    type: "SetError",
    payload: {message}
  })
}

export const addMove = (playerId, move) => async (dispatch) => {
  dispatch({
    type: "AddMove",
    payload: { playerId, move }
  })
}

export const clearMoves = () => async (dispatch) => {
  dispatch({
    type: "ClearMoves",
    payload: {}
  })
}
