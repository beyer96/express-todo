import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setUser: (_, action: PayloadAction<UserState>): UserState => {
      return action.payload;
    }
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
