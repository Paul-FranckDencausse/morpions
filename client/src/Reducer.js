import { createReducer } from '@reduxjs/toolkit';

const initialState = {};

export const playerReducer = createReducer(initialState, {

  AddPlayer: (state, action) => {
    state.player = action.payload;
  },

});

export const errorReducer = createReducer({}, {

  SetError: (state, action) => {
    state.error = action.payload;
  }

});

export const moveReducer = createReducer({}, {

  AddMove: (state, action) => {
    state.playerMoves = Object.assign({}, state.playerMoves, { [action.payload.move]: action.payload.playerId});
  },

  ClearMoves: (state, action) => {
    state.playerMoves = {};
  }

});