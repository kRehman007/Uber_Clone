import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}
interface User {
  firstname: string;
  lastname: string;
  email: string;
  _id: string | number;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    removeUser: (state) => {
      (state.user = null), (state.isAuthenticated = false);
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
