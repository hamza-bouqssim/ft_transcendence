import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from './conversationSlice';
import messageReducer from './messageSlice';
import requestReducer from './requestSlice';
import UsersReducer from './usersSlice';
import roomReducer from './roomsSlice';
import friendsReducer from './friendsSlice';
import friendsBlockReducer from './blockSlice'

export const store = configureStore({
  reducer: {
    conversation: conversationReducer,
    messages: messageReducer,
    request : requestReducer,
    users : UsersReducer,
    room: roomReducer,
    friends : friendsReducer,
    friendsBlock : friendsBlockReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;