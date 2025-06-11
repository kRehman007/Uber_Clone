import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Captain {
  fullname: {
    firstname: string;
    lastname: string;
  };
  email: string;
  color: string;
  plate: string;
  capacity: string | number;
  type: string;
  _id: string | number;
}

interface CaptainState {
  captain: Captain | null;
  isAuthenticated: boolean;
}
const initialState: CaptainState = {
  captain: null,
  isAuthenticated: false,
};

export const captainSlice = createSlice({
  name: "captain",
  initialState,
  reducers: {
    setCaptain: (state, action: PayloadAction<Captain>) => {
      (state.captain = action.payload), (state.isAuthenticated = true);
    },
    removeCaptain: (state) => {
      (state.captain = null), (state.isAuthenticated = false);
    },
  },
});

export const { setCaptain, removeCaptain } = captainSlice.actions;
export default captainSlice.reducer;
