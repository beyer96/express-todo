import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

const initialState = {
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  username: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_, action: PayloadAction<UserState>): UserState => {
      return action.payload;
    },
    unsetUser: () => {
      return initialState;
    }
  }
});

export const { setUser, unsetUser } = userSlice.actions;
export default userSlice.reducer;
