import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const asyncPopulateUsers = createAsyncThunk(
  'users/populate',
  async (_, { rejectWithValue }) => {
    try {
      const users = await api.getAllUsers();
      return users;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncPopulateUsers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(asyncPopulateUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
