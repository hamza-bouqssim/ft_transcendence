import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from './conversationSlice';
import messageReducer from './messageSlice';
import roomReducer from './roomsSlice'

export const store = configureStore({
  reducer: {
    conversation: conversationReducer,
    messages: messageReducer,
    room: roomReducer,
  },
  middleware: (getDefaultMiddleware : any) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;