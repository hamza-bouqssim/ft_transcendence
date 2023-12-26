import { configureStore } from '@reduxjs/toolkit';
import conversationReducer from './conversationSlice';
import messageReducer from './messageSlice';
import requestReducer from './requestSlice';
import UsersReducer from './usersSlice';
import roomReducer from './roomsSlice';
import friendsReducer from './friendsSlice';
import friendsBlockReducer from './blockSlice';
import NotificationReducer from './notificationSlice';
import memberReducer from './memberSlice';
import UsersAuthReducer from './AuthSlice';
import messagesUnreadReducer from './UnreadMessages';
import requestsReducer from './requestsSlice';


export const store = configureStore({
  reducer: {
    conversations: conversationReducer,
    messages: messageReducer,
    request : requestReducer,
    requests : requestsReducer,
    friends : friendsReducer,
    friendsBlock : friendsBlockReducer,
    users : UsersReducer,
    notification : NotificationReducer,
    room: roomReducer,
    member:memberReducer,
    UsersAuth : UsersAuthReducer,
    messagesUnread : messagesUnreadReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;