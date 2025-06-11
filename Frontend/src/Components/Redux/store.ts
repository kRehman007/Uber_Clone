import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./Slices/user-Slice";
import { captainSlice } from "./Slices/captain-Slice";
import { GoogleMapAPI } from "./RTK/GoogleMapAPI";
import { socketSlice } from "./Slices/socket-slice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    captain: captainSlice.reducer,
    socket: socketSlice.reducer,
    [GoogleMapAPI.reducerPath]: GoogleMapAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(GoogleMapAPI.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
