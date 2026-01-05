import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const asyncPopulateLeaderboards = createAsyncThunk(
  'leaderboards/populate',
  async (_, { rejectWithValue }) => {
    try {
      const leaderboards = await api.getLeaderboards();
      return leaderboards;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboards',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncPopulateLeaderboards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(asyncPopulateLeaderboards.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(asyncPopulateLeaderboards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default leaderboardSlice.reducer;
