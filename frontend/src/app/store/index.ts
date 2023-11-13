import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from './conversationSlice';
import messageReducer from './messageSlice';

export const store = configureStore({
  reducer: {
    conversation: conversationReducer,
    messages: messageReducer,
  },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({ serializableCheck: false }),
//   devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;