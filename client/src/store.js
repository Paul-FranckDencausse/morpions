import { configureStore } from '@reduxjs/toolkit';
import { errorReducer, playerReducer, moveReducer } from './Reducer';

const store = configureStore({
  reducer: {
    player: playerReducer,
    error: errorReducer,
    playerMoves: moveReducer,
  },
})

export default store;